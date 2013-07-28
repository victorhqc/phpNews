<?php

abstract Class BDAbstracta {
	protected $BD;
	protected $host;
	protected $usuario;
	protected $contraseña;
	protected $bd;
	protected $obj;
	protected $query;
	protected $error = 'Ha habido un error en la base de datos.';
	protected $mensaje = 'Se ha ejecutado la consulta exitosamente.';
	
	public final function __construct($json){
		if(!array_key_exists('tipo', $json)){
			throw new Exception('No se ha especificado el tipo de Bases de datos que se usará.');
		}
		if(!array_key_exists('host', $json)){
			throw new Exception('No se ha especificado el host.');
		}
		if(!array_key_exists('usuario', $json)){
			throw new Exception('No se ha especificado el usuario.');
		}
		if(!array_key_exists('contraseña', $json)){
			throw new Exception('No se ha especificado la contraseña.');
		}
		if(!array_key_exists('bd', $json)){
			throw new Exception('No se ha especificado la base de datos.');
		}
		
		foreach($json as $prop => $valor){
			$this->{$prop} = $valor;
		}
		
		$this->inicializacion();
	}
	
	public function __destruct(){
		
	}
	
	public function __set($prop, $valor){
		 $this->$prop = $valor;
	}
	
	public function __get($prop){
		return $this->$prop;
	}

	public function establishConnection($host = null, $usuario = null, $contraseña = null, $bd = null){
		$this->establezcoConexion($host, $usuario, $contraseña, $bd);
	}
	
	public function establecerConexion($host = null, $usuario = null, $contraseña = null, $bd = null){
		$this->establezcoConexion($host, $usuario, $contraseña, $bd);
	}

	public function closeConnection(){
		$this->cierroConexion();
	}
	
	public function cerrarConexion(){
		$this->cierroConexion();
	}

	public function query($query, $error = null){
		$this->consulto($query, $error);
	}
	
	public function consulta($query, $error = null){
		$this->consulto($query, $error);
	}

	public function data($solodatos = null, $mensaje = null){
		return $this->datos($solodatos, $mensaje);
	}
	
	public function datos($solodatos = null, $mensaje = null){
		$respuesta = $this->resultados($solodatos, $mensaje);
		if(!array_key_exists('exito', $respuesta)){
			throw new Exception('No se declaró "exito"');
		}
		if(!array_key_exists('mensaje', $respuesta)){
			throw new Exception('No se declaró el mensaje de respesta para la UI del usuario');
		}
		if(!array_key_exists('datos', $respuesta)){
			throw new Exception('La respuesta de la base de datos debe ser contenida en "datos", la cual no ha sido especificada');
		}
		
		if($solodatos == true){
			$respuesta = $respuesta['datos'];
		}
		
		return $respuesta;
	}

	public function lastID(){
		return $this->ultimoIDinsertado();
	}
	
	public function ultimoID(){
		$respuesta = $this->ultimoIDinsertado();
		
		return $respuesta;
	}
	
	//Modo de Uso:
	// $bd->columnasTabla('nombre_de_columna', array('columna3', 'columna4'));
	// lo contenido en $omitir, no será mostrado en el resultado final
	
	public function columnasTabla($tabla, $omitir = array()){
		return $this->muestroColumnasTabla($tabla, $omitir);
	}
	
	abstract protected function inicializacion();
	abstract protected function consulto($query, $error = null);
	abstract protected function resultados($mensaje = null);
	abstract protected function ultimoIDinsertado();
	abstract protected function establezcoConexion($host = null, $usuario = null, $contraseña = null, $bd = null);
	abstract protected function cierroConexion();
	abstract protected function muestroColumnasTabla($tabla, $omitir = array());
}

class BD extends BDAbstracta{
	protected function inicializacion(){
		$json = get_object_vars($this);
		$this->BD = new $json['tipo']($json);
	}
	
	protected function consulto($query, $error = null){
		$this->BD->consulto($query, $error);
	}
	
	protected function resultados($mensaje = null){
		return $this->BD->resultados($mensaje);
	}
	
	protected function establezcoConexion($host = null, $usuario = null, $contraseña = null, $bd = null){
		$this->BD->establezcoConexion($host, $usuario, $contraseña, $bd);
	}
	
	protected function cierroConexion(){
		$this->BD->cierroConexion();
	}
	
	protected function ultimoIDinsertado(){
		return $this->BD->ultimoIDinsertado();
	}
	
	protected function muestroColumnasTabla($tabla, $omitir = array()){
		return $this->BD->muestroColumnasTabla($tabla, $omitir);
	}
}

Class Vi_mysql extends BDAbstracta {
	
	
	protected function inicializacion(){
		$this->establezcoConexion($host = null, $usuario = null, $contraseña = null, $bd = null);
	}
	
	protected function consulto($query, $error = null){
		$mierror = $this->error;
		if($error != null){
			$mierror = $error;
		}
		
		$this->query = $this->obj->query($query);
		
		if($this->query == false){
			die(json_encode(array('message' => $mierror, 'success' => false, 'BD' =>$this->obj->error, 'SQL' => $query)));
		}
	}
	
	protected function resultados($mensaje = null){
		
		$mimensaje = $this->mensaje;
		if($mensaje != null){
			$mimensaje = $mensaje;
		}
		
		$datos = array();
		while($dato = $this->query->fetch_assoc()){
			$datos[] = array_map('utf8_encode', $dato);
		}
		
		$respuesta = array('datos' => $datos, 'mensaje' => $mimensaje, 'success' => true);
		return $respuesta;
	}
	
	protected function ultimoIDinsertado(){
		$id = $this->obj->insert_id;
		return $id;
	}
	
	protected function muestroColumnasTabla($tabla, $omitir = array()){
		//die(var_dump($this));
		$columnasSelect = "SELECT column_name AS columna FROM information_schema.columns WHERE table_schema = '".$this->bd."' AND table_name = '".$tabla."'";
		$wheres = "";
		for($i = 0; $i < count($omitir); $i++){
			$wheres .= " AND column_name != '".$omitir[$i]."'";
		}
		$columnasSelect .= $wheres;
		$this->consulto($columnasSelect);
		$columnas = $this->resultados();
		$columnas = $columnas['datos'];
		
		return $columnas;
	}
	
	protected function establezcoConexion($host = null, $usuario = null, $contraseña = null, $bd = null){
		if($host == null){
			$host = $this->host;
		}
		if($usuario == null){
			$usuario = $this->usuario;
		}
		if($contraseña == null){
			$contraseña = $this->contraseña;
		}
		if($bd == null){
			$bd = $this->bd;
			
		}
		
		$this->obj = new mysqli($host, $usuario, $contraseña, $bd);
		if ($this->obj->connect_errno) {
			$err = array('message' => 'Connection failed', 'debug' => 'MySQL Connection failed', 'success' => false, 'errno' => $this->obj->connect_errno, 'errors' => $this->obj->connect_error);
		    die(json_encode($err));
		}
	}
	
	protected function cierroConexion(){
		$this->obj->close();
	}
}

?>