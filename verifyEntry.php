<?php
require_once (__DIR__.'/db.php');
require_once (__DIR__.'/identity.php');

$bd = startDB();

$d = $_POST;


$bd->query("SELECT * FROM users WHERE email= '".$d['email']."'");
$data = $bd->data(true);

die(var_dump($data));

$key = $d['email'].'//-@encriptionkey@-//'.$d['email'];
$string = $d['password'];

//$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $string, MCRYPT_MODE_CBC, md5(md5($key))));
$decrypted = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($encrypted), MCRYPT_MODE_CBC, md5(md5($key))), "\0");

echo "<p>".var_dump($decrypted)."</p>";

?>