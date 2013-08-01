<?php
require_once(__DIR__.'/object.class.php');

class ManyNews extends Object {
	public $manyNews;

	public function __construct(){
		$this->dbInit();

		$this->manyNews = $this->gatherData();
	}

	private function gatherData(){
		$q = "SELECT idNew AS id FROM news";
		$this->_db->query($q);
		$data = $this->_db->data(true);

		$manyNews = array();
		foreach($data as $t){
			$arr = array('id' => $t['id']);
			$news = new News($arr);
			$news = $news->getData();
			$manyNews[] = $news;
		}

		return $manyNews;
	}
}

class News extends Object {
	public $id;
	public $title;
	public $message;
	public $tags;
	public $files;

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


	//Create functions
	//----------------
	
	private function create($d){
		//First, register the main data, which are the non-array keys of the array
		$query = "";
		$columns = "";
		$values = "";

		$complex = array();
		foreach ($d as $key => $value) {
			$t = gettype($value);
			if($t != 'array'){
				if($value != ''){
					$columns .= $key.", ";
					$values .= "'".$value."', ";
				}
			}else{
				$complex[$key] = $value;
			}
		}

		$values = substr($values, 0, -2);
		$columns = substr($columns, 0, -2);

		$query = "INSERT INTO news (".$columns.") VALUES (".$values.")";
		$this->_db->query($query);
		$this->id = $this->_db->lastID();

		foreach ($complex as $key => $value) {
			$func = 'link_'.$key;
			$this->$func($value);
		}
	}

	private function link_tags($tags){
		foreach ($tags as $tag) {
			$query = "INSERT INTO newsTags (idNew, idTag) VALUES (".$this->id.", ".$tag['id'].")";
			$this->_db->query($query);
		}
	}

	private function link_files($file){

	}

	//Get functions
	//-------------
	
	private function gatherData($id){
		$q = "SELECT title, message, idNew AS id FROM news WHERE idNew=".$id;
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

	private function gatherTags(){

	}

	private function gatherFiles(){

	}

	//Search functions
	//----------------
	
	private function search($p){

	}
}

?>