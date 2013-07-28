<?php
require_once(__DIR__.'/object.class.php');

class Tags extends Object {
	private $tags;

	public function __construct(){
		$this->dbInit();

		$this->tags = $this->gatherData();
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
}

class Tag extends Object {
	private $name;
	private $id;

	public function __construct($d){
		$this->dbInit();

		if(array_key_exists('id', $d)){
			$this->gatherData($d['id']);
		}else if(array_key_exists('search', $d)){
			$this->search($d['search']);
		}
	}

	private function gatherData($id){
		$q = "SELECT name, idTag AS id FROM tags WHERE idTag=".$id;
		$this->_db->query($q);
		$d = $this->_db->data(true);
		if(count($d) > 0){

		}else{
			die(json_encode($this->_err));
		}
	}

	private function search($p){

	}
}

?>