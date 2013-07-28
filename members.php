<?php
include (__DIR__.'/db.php');
include (__DIR__.'/identity.php');


$identidad = new Identidad();
echo $identidad->verify();

?> 