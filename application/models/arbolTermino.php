<?php
class arbolTermino extends CI_Model{

	function loadArbol(){
		$result = $this->db->query("SELECT ParentKey, COUNT(ParentKey) AS Numero 
									FROM metadata 
									GROUP BY ParentKey
									ORDER BY ParentKey");
		if($result){
			$filas=$result->result_array();
			$childrens='';
			foreach ($filas as $fila) {
				if ($fila == end($filas)){
					$childrens .= '{"id":"'.$fila['ParentKey'].'","name":"'.$fila['ParentKey'].'","data":{"column":"ParentKey"},"children":[]}';
				}
				else{
					$childrens .= '{"id":"'.$fila['ParentKey'].'","name":"'.$fila['ParentKey'].'","data":{"column":"ParentKey"},"children":[]},';
				}
				
			}
			$root = '{"id":"0","name":"Styles and periods","children":['.$childrens.']}';
			return $root;
		}
		else{
			return "";
		}		
	}

	function agregarHijos($codigoPadre){
		$result = $this->db->query("SELECT m.id_europeana_term, e.termNameUtf8  
									FROM metadata m 
									INNER JOIN europeanaterms e
									ON m.id_europeana_term = e.id_europeana_term
									WHERE m.ParentKey = $codigoPadre
									GROUP BY e.id_europeana_term");
		
		if($result){
			$filas = $result->result_array();
			$childrens="";
			foreach ($filas as $fila) {
				if($fila == end($filas)){
					$childrens .= '{"id":"'.$fila['id_europeana_term'].'","name":"'.str_replace('"', "", $fila['termNameUtf8']).'","data":{"column":"id_europeana_term"},"children":[]}';
				}
				else{
					$childrens .= '{"id":"'.$fila['id_europeana_term'].'","name":"'.str_replace('"', "", $fila['termNameUtf8']).'","data":{"column":"id_europeana_term"},"children":[]},';
				}								
			}
			$root = '{"id":"'.$codigoPadre.'","name":"'.$codigoPadre.'","children":['.$childrens.']}';
			return $root;
		}
		else{
			return "";
		}
	}

}