<?php
$root = __DIR__.'/../../../';
$url = $root.'core/libraries/';
require_once ($root.'verifyMembers.php');
require_once ($url.'tags.class.php');
require_once ($url.'news.class.php');

//Get the news
$p = $_POST;
$p['get'] = 'regular'; // Regular news (Gets all the news with pagination)
$news = new ManyNews($p);
$news = $news->news;

//Get the popular tags
$tags = new Tags(array('get' => 'popular'));
$tags = $tags->tags;

$r = array('news' => $news, 'popularTags' => $tags);

echo json_encode($r);
?>