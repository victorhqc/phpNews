<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once ($root.'verifyMembers.php');
require_once ($url.'news.class.php');

$n = new News(array('delete' => $_POST['id']));


$r = array('success' => true);
echo json_encode($r);
?>