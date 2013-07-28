<?php
include (__DIR__.'/db.php');
include (__DIR__.'/identity.php');

$identidad = new Identity();
$i =  $identidad->verify();
?> 