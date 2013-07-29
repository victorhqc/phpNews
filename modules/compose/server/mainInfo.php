<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once($root.'verifyMembers.php');
require_once($url.'tags.class.php');

$tags = new Tags();
$tags = $tags->getData();

$response = array('tags' => $tags['tags']);

echo json_encode($response);
?>