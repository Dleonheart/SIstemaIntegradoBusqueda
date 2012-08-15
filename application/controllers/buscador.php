<?php 

class Buscador extends CI_Controller{

	function index(){
		$this->load->view('inicio');
	}

	function termino(){
		$this->load->model('pieTermino');
		$criterios = array('EuropeanaRights','Country','Language','Type','Provider');
		$datos= array();
		$pies = array();
		foreach ($criterios as $criterio) {

			$result = $this->pieTermino->consultPie($criterio, $this->input->post('termino'));
			if($result){
				$pies[] = $result;
			}else{
				$pies = array("mensaje" => "lo sentimos, no se encontraron rescursos asociados");
				break;
			}
		}
		$datos[] = $pies;
		$datos[] = $this->pieTermino->getId($this->input->post('termino'));				
		echo json_encode($datos);
		return;
	}

	function listaTerminos(){
		$this->load->model('pieTermino');
		echo json_encode($this->pieTermino->getTerminos());
	}

	function cargarSubArbol(){
		$nodeId = $this->input->post('nodeId');
		$this->load->model('arbolTermino');
		echo $this->arbolTermino->agregarHijos($nodeId);
	}
	function cargarArbol(){
		$this->load->model('arbolTermino');
		echo $this->arbolTermino->loadArbol();
	}

	function pieArbol(){
		$this->load->model('pieTermino');
		$criterios = array('EuropeanaRights','Country','Language','Type','Provider');
		$datos= array();

		foreach ($criterios as $criterio) {
			$result = $this->pieTermino->pieArbol($this->input->post('id'),$this->input->post('column'),$criterio);
			if($result){
					$datos[] = $result;
				}else{
					$datos = array("mensaje" => "lo sentimos, no se encontraron recursos asociados");
					break;
				}

		}				
		echo json_encode($datos);return;	
	}
}


