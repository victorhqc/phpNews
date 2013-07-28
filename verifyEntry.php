<?php
require_once (__DIR__.'/db.php');
require_once (__DIR__.'/identity.php');

$bd = startDB();

$d = $_POST;


$bd->query("SELECT * FROM users WHERE email= '".$d['email']."'");
$data = $bd->data(true);

$response = array('message' => 'You have no access', 'success' => false);
if(count($data) > 0){
	$data = $data[0];
	$key = $d['email'].'//-@encriptionkey@-//'.$d['email'];
	$string = $d['password'];

	//$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $string, MCRYPT_MODE_CBC, md5(md5($key))));
	$decrypted = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($data['password']), MCRYPT_MODE_CBC, md5(md5($key))), "\0");

	if($string == $decrypted){
		$response = array('message' => 'Welcome', 'success' => true);

		//The cookies are set.
		$arr = array('username' => $data['email'], 'password' => $data['password']);
		$identity = new Identity($arr);
		$identity->setIdentity();
	}
}

echo json_encode($response);

?>