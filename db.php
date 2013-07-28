<?php
require_once (__DIR__.'/core/libraries/db.class.php');

function startDB(){
	$con = null;
	$server_db = 'localhost'; //Your host
	$clientes_db = 'clientes'; //Your db
	$usuario_db = 'username'; //Your username for the db
	$pass_db = 'password'; //Your password for the db
	
	$myDB = new BD(array('tipo' => 'Vi_mysql', 'host' => $server_db, 'usuario'=> $usuario_db, 'contraseña' => $pass_db, 'bd' => $clientes_db));

	return $myBD;
}

?>