<?php

$root = __DIR__.'/../../../';
require_once($root.'verifyMembers.php'); // <---- Securty file
require_once($root.'/core/libraries/news.class.php');

function decoder($value){
	$v;
	if(gettype($value) == 'array'){
		foreach ($value as $key => $val) {
			if(get_magic_quotes_gpc()){
				$val = stripslashes($val); // <---- Legacy support
			}
			$t = json_decode($val, true);
			if($t != null){
				$value[$key] = $t;
			}
		}
		$v = $value;
	}else{
		$v = json_decode($value, true);
	}

	return $v;
}

$data = $_POST;
$data = decoder($data);

$i = $identity->getUserId(); // <---- Obtained through verifyMembers.php
$data['idUser'] = $i;
$data['title'] = utf8_decode($data['title']);
$data['title'] = urlencode(utf8_encode($data['title']));
$data['description'] = utf8_decode($data['description']);
$data['description'] = urlencode(utf8_encode($data['description']));

$arr = array('create' => $data);
$news = new News($arr);

$r = array('success' => true);
echo json_encode($r);
?>