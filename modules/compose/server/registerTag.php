<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once($root.'verifyMembers.php');
require_once($url.'tags.class.php');

$tag = $_POST['tag'];

$t = new Tag(array('create' => $tag));

$r = array('success' => true);
echo json_encode($r);
?>