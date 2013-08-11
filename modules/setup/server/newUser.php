<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once ($root.'identity.php');
require_once ($root.'db.php');

$identidad = new Identity();
$i =  $identidad->verify();

$r = array('success' => false, 'message' => 'You have no access');
if(array_key_exists('nousers', $i) && $i['nousers'] === true){
	$password = $_POST['password'];
	unset($_POST['password2']);
	$key = $_POST['email'].'//-@encriptionkey@-//'.$_POST['email'];
	
	$string = $password;
	$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $string, MCRYPT_MODE_CBC, md5(md5($key))));

	$_POST['password'] = $encrypted;

	$cols = "";
	$data = "";
	foreach ($_POST as $key => $value) {
		$cols .= $key.", ";
		$data .= "'".utf8_encode($value)."', ";
	}
	$cols = substr($cols, 0, -2);
	$data = substr($data, 0, -2);

	$q = "INSERT INTO users (".$cols.") VALUES (".$data.")";
	$db = startDB();
	$db->query($q);
	$r = array('success' => true, 'message' => 'User created!');
}

echo json_encode($r);
?>