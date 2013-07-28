<?php
class Identity {
	private $username;
	private $cookieUsr = "Uvi";
	private $password;
	private $cookiePass = "Kvi";
	private $tiempo;
	private $tmp;
	
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
		$tiempo = time() + $this->tmp;
		$this->tiempo = $tiempo;
		
		setcookie($this->cookieUsr, $this->username, $this->tiempo); // <------- Username
		setcookie($this->cookiePass, $this->password, $this->tiempo); // <------- Password
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
		$tiempo = time() - $this->tmp;
		echo($this->cookieUsr);
		setcookie($this->cookieUsr, "gone", $tiempo);
		setcookie($this->cookiePass, "gone", $tiempo);
	}
	
	//Verifies las cookies
	public function verify(){
		$datos = $this->getIdentity();
		if($datos['error'] == true){
			die(json_encode(array('success' => false, 'message' =>'You have no access')));
		}else{
			return array('success' => true);
		}
	}
}
?>