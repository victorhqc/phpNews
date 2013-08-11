<?php
require_once (__DIR__.'/db.php');

class Identity {
	private $username;
	private $cookieUsr = "Uvi";
	private $password;
	private $cookiePass = "Kvi";
	private $tiempo;
	private $tmp;
	private $_db;

	public function __construct($json = null){
		if($json != null){
			foreach($json as $prop => $valor){
				$this->{$prop} = $valor;
			}
		}
		
		$this->tmp = (3600*24*31*12*10); //3600 seconds * 24 hours * 31 días * 12 months * 10 years
	}
	
	public function __set($prop, $valor){
		 $this->$prop = $valor;
	}
	
	public function __get($prop){
		return $this->$prop;
	}
	
	//Cookies principales de identidad
	public function setIdentity(){
		$time = time() + $this->tmp;
		$this->time = $time;
		
		setcookie($this->cookieUsr, $this->username, $this->time); // <------- Username
		setcookie($this->cookiePass, $this->password, $this->time); // <------- Password
	}
	
	//Obtiene la identidad del username.
	public function getIdentity(){
		$error = false;
		
		if(array_key_exists($this->cookieUsr, $_COOKIE)){
			$this->username = $_COOKIE[$this->cookieUsr];
		}else{
			$error = true;
		}
		
		if(array_key_exists($this->cookiePass, $_COOKIE)){
			$this->password = $_COOKIE[$this->cookiePass];
		}else{
			$error = true;
		}
		
		return array('pass' => $this->password, 'username' => $this->username, 'error' => $error);
	}
	
	//Destruye cookies de identidad
	public function destroyIdentity(){
		$time = time() - $this->tmp;
		setcookie($this->cookieUsr, "gone", $time);
		setcookie($this->cookiePass, "gone", $time);
	}


	//Verifies las cookies
	public function verify(){
		$this->_db = startDB();
		$vf = $this->verifiesExistingUsers();
		if($vf['nousers'] === true){
			return $vf;
		}
		$data = $this->getIdentity();
		$err = array('message' => 'You have no access', 'success' => false);
		if($data['error'] == false){			
			//Once the cookies exist, now they are tested
			$this->_db->query("SELECT * FROM users WHERE email= '".$data['username']."' AND password = '".$data['pass']."'");
			$d = $this->_db->data(true);

			if(count($d) > 0){
				return array('success' => true, 'message' => 'Welcome');
			}
		}

		$this->destroyIdentity();
		die(json_encode($err));
	}

	private function verifiesExistingUsers(){
		//Is there a user registered?
		$q = $this->_db->query("SELECT COUNT(idUser) AS i FROM users");
		$t = $this->_db->data(true);
		$t = $t[0];

		$i['nousers'] = false;
		if((int)$t['i'] == 0){
			$i['nousers'] = true;
			$i['success'] = false;
			return $i;
		}
	}
	
	//For Login use only!
	public function initialVerification(){
		$this->_db = startDB();
		$data = $this->getIdentity();
		$err = array('message' => 'You have no access', 'success' => false);
		//Once the cookies exist, now they are tested
		$this->_db->query("SELECT * FROM users WHERE email= '".$data['username']."'");
		$d = $this->_db->data(true);

		if(count($d) > 0){
			$d = $d[0];
			$key = $d['email'].'//-@encriptionkey@-//'.$d['email'];
			$string = $data['pass'];

			//$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $string, MCRYPT_MODE_CBC, md5(md5($key))));
			$decrypted = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($d['password']), MCRYPT_MODE_CBC, md5(md5($key))), "\0");

			if($string == $decrypted){
				$this->username = $d['email'];
				$this->password = $d['password'];
				$this->setIdentity();
				return array('success' => true, 'message' => 'Welcome');
			}
		}

		$this->destroyIdentity();
		die(json_encode($err));
	}

	public function getUserId(){
		if($this->_db == null){
			$this->_db = startDB();
		}

		$d = $this->getIdentity();

		$this->_db->query("SELECT idUser FROM users WHERE email = '".$d['username']."' AND password = '".$d['pass']."'");
		$data = $this->_db->data(true);
		$id = $data[0]['idUser'];

		return $id;
	}
}
?>