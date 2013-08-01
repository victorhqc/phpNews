<?php
include (__DIR__.'/db.php');
include (__DIR__.'/identity.php');

$identity = new Identity();
$identity->verify();
?> 