<?php
require_once (__DIR__.'/../../db.php');

abstract class Object {
	protected $_db;
	protected $_err = array('err' => 'err-mainserver', 'success' => false);

	public function __construct(){
		
	}
	
	public function __destruct() {
		
	}
	
	public function __toString() {
		return var_export(get_object_vars($this));
	}
	
	public function __set($prop, $valor){
			 $this->{$prop} = $valor;
	}
	
	public function __get($prop){
		if(property_exists('Object', $prop)){
			return $this->{$prop};
		}		
	}
	
	public function getData($hidden = false){
		//Se agregan datos extras.
		$p = get_object_vars($this);
		if($hidden === false){
			foreach ($p as $key => $value) {
				preg_match_all('(^_)', $key, $e);
				if(count($e[0]) > 0){
					unset($p[$key]);
				}
			}
		}
		
		return $p;
	}
	
	protected function newData($datos){
		foreach ($datos as $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	protected function dbInit(){
		$this->_db = startDB();
	}
}


?>