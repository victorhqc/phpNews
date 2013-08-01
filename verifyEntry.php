<?php
require_once (__DIR__.'/db.php');
require_once (__DIR__.'/identity.php');

$bd = startDB();

$d = $_POST;

//The cookies are set.
$arr = array('username' => $d['email'], 'password' => $d['password']);
$identity = new Identity($arr);
$identity->setIdentity();
$response = $identity->initialVerification();

echo json_encode($response);

?>