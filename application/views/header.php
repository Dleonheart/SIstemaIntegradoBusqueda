<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="<?php echo base_url().'assets/css/styles.css'?>">
	<title>Sistema integrado de búsqueda</title>
</head>
<body>
	<div class="searchTag">Arriba!!!</div>
	<header>
		<div class="container_12">
			<h1 class="logo grid_3">
				Sistema <br>
				Integrado <br>
				de búsqueda</h1>
			<form action="<?php echo site_url("buscador/termino"); ?>" class="grid_4 push_5" id="form_buscador" method="POST">
				<button type ='submit' class="ico"></button>
				<input type="text" class="inputField" required  name="termino">
			</form>
		</div>		
	</header><!-- Fin del Header -->
	<div class="separator"></div>