<?php
require_once(__DIR__.'/object.class.php');

class Tags extends Object {
	public $tags;
	public $get = 'all';

	public function __construct($props = null){
		$this->dbInit();

		if($props != null){
			$this->newData($props);
		}

		$tags = array();
		switch($this->get){
			case 'popular':
				$tags = $this->popularTags();
			break;
			case 'used':
				$tags = $this->usedTags();
			break;
			case 'all':
			default:
				$tags = $this->gatherData();
			break;
		}

		$this->tags = $tags;
	}

	private function gatherData(){
		$q = "SELECT idTag AS id FROM tags";
		$this->_db->query($q);
		$data = $this->_db->data(true);

		$tags = array();
		foreach($data as $t){
			$arr = array('id' => $t['id']);
			$tag = new Tag($arr);
			$tag = $tag->getData();
			$tags[] = $tag;
		}

		return $tags;
	}

	//Gets the most popular tags
	private function popularTags(){
		$q = "SELECT COUNT(a.idTag) AS times, b.idTag AS id FROM newsTags AS a RIGHT OUTER JOIN tags AS b ON a.idTag=b.idTag GROUP BY b.idTag ORDER BY times DESC LIMIT 0,10";

		return $this->genericUsedTag($q);
	}

	//Gets tags that have are linked to a news at least once
	private function usedTags(){
		$q = "SELECT COUNT(a.idTag) AS times, b.idTag AS id FROM newsTags AS a RIGHT OUTER JOIN tags AS b ON a.idTag=b.idTag GROUP BY b.idTag HAVING COUNT(a.idTag) > 0 ORDER BY times";

		return $this->genericUsedTag($q);
	}

	//Used for most gathering functions (that involves use of a tag)
	private function genericUsedTag($q){
		$this->_db->query($q);
		$data = $this->_db->data(true);

		$tags = array();
		foreach($data as $t){
			$arr = array('id' => $t['id']);
			$tag = new Tag($arr);
			$tag = $tag->getData();
			$tag['times'] = $t['times'];
			$tags[] = $tag;
		}

		return $tags;
	}
}

class Tag extends Object {
	public $name;
	public $id;

	public function __construct($d){
		$this->dbInit();

		if(array_key_exists('id', $d)){
			$this->gatherData($d['id']);
		}else if(array_key_exists('search', $d)){
			$this->search($d['search']);
		}else if(array_key_exists('create', $d)){
			$this->create($d['create']);
		}
	}

	private function create($name){
		//Does it already exists?
		$this->_db->query("SELECT idTag FROM tags WHERE name ='".$name."'");
		$verif = $this->_db->data(true);
		if(count($verif) == 0){
			//It does not exists, proceed to create
			$q = "INSERT INTO tags (name) VALUES ('".utf8_decode($name)."')";
			$this->_db->query($q);
		}else{
			die(json_encode($this->_err));
		}
	}

	private function gatherData($id){
		$q = "SELECT name, idTag AS id FROM tags WHERE idTag=".$id;
		$this->_db->query($q);
		$d = $this->_db->data(true);
		if(count($d) > 0){
			$d = $d[0];
			foreach ($d as $key => $value) {
				$this->{$key} = $value;
			}
		}else{
			die(json_encode($this->_err));
		}
	}

	private function search($p){

	}
}

?>