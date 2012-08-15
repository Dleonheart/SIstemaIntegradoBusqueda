<?php 
class pieTermino extends CI_Model{

	function getTerminos(){
		$result = $this->db->query("SELECT termNameUtf8 FROM europeanaterms");
		if($result){
			return $result->result_array();
		}
	}

	
	function getId($termino){
		$result = $this->db->query("SELECT m.id_europeana_term, m.ParentKey 
									FROM europeanaterms e
									INNER JOIN metadata m
									ON e.id_europeana_term = m.id_europeana_term
									WHERE e.termNameUtf8 = '$termino'");
		if($result){
			return $result->row();
		}
	}

	function consultPie($column, $termino){
		$result = $this->db->query("SELECT $column, COUNT($column) AS Numero
									FROM (
									SELECT id_metadata_term, term_id, termNameUtf8, $column
									FROM metadata 
									INNER JOIN europeanaterms 
									ON metadata.id_europeana_term = europeanaterms.id_europeana_term
									WHERE europeanaterms.termNameUtf8 = '$termino') 
									AS nuevaTabla
									GROUP BY $column");
		if($result->result_array()){
			return array($column, $this->crearJsonPie($column, $result),$result->result_array());			
		}else{
			return false;
		}
	}

	function pieArbol($codigo, $columna, $column){
		$result = $this->db->query("SELECT $column, COUNT($column) AS Numero
									FROM metadata
									WHERE $columna = $codigo
									GROUP BY $column");
		if($result){
			return array($column, $this->crearJsonPie($column, $result),$result->result_array());			
		}
	}

	function crearJsonPie($criterio, $result){
		$filas = $result->result_array();
		$titulos ='"label":["'.$criterio.'"],';
		$valores= '"values":[';
		foreach ($filas as $fila) {
			if ($fila == end($filas)){
				$valores .= '{"label":"'.$fila[$criterio].'","values":['.$fila['Numero'].']}]';
			}
			else{
				$valores .= '{"label":"'.$fila[$criterio].'","values":['.$fila['Numero'].']},';
			}
		}
		$final = "{".$titulos.$valores."}";
		return $final;
	}	
}
	
