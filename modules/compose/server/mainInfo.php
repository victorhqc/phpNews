<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once($root.'verifyMembers.php');
require_once($url.'tags.class.php');

//Existint tags
$tags = new Tags();
$tags = $tags->getData();

//Max upload size
$maxSize = ini_get('post_max_size');

$response = array('tags' => $tags['tags'], 'maxUpload' => $maxSize);

echo json_encode($response);
?>