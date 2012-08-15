<?php $this->load->view('header.php'); ?>


<section id="visualArea">
		<div class="container_12">
			<div id="arbol" class="grid_12"></div>
				<div class="piesContainer">				
					<div class="pieHolder grid_6 clearfix ">
						<div class="pie" id="Language"></div>
						<div class="pieContent">
							<script type="text/x-handlebars-template" id="LanguageConv">
								<div>			
									<h3>Language</h3>
									<ul>								
										{{#each this}}
											<li>
												<div class="color" style="background-color:{{color}};"></div>
												<p>{{nombreCampo}}: {{cantidadRecursos}}</p>
											</li>	
										{{/each}}
									</ul>
								</div>
							</script>
						</div>
					</div>
					<div class="pieHolder grid_6 clearfix ">
						<div class="pie" id="Country"></div>
						<div class="pieContent">
							<script type="text/x-handlebars-template" id="CountryConv">
								<div>
									<h3>Country</h3>
									<ul>								
										{{#each this}}
											<li>
												<div class="color" style="background-color:{{color}};"></div>
												<p>{{nombreCampo}}: {{cantidadRecursos}}</p>
											</li>	
										{{/each}}
									</ul>
								</div>
							</script>
						</div>
					</div>
					<div class="pieHolder grid_6 clearfix">
						<div class="pie" id="Type"></div>
						<div class="pieContent">
							<script type="text/x-handlebars-template" id="TypeConv">
								<div>
									<h3>Type</h3>
									<ul>								
										{{#each this}}
											<li>
												<div class="color" style="background-color:{{color}};"></div>
												<p>{{nombreCampo}}: {{cantidadRecursos}}</p>
											</li>	
										{{/each}}
									</ul>
								</div>
							</script>
						</div>
					</div>
					<div class="pieHolder grid_6 clearfix">
						<div class="pie" id="Provider"></div>
						<div class="pieContent">
							<script type="text/x-handlebars-template" id="ProviderConv">
								<div>
									<h3>Provider</h3>
									<ul>								
										{{#each this}}
											<li>
												<div class="color" style="background-color:{{color}};"></div>
												<p>{{nombreCampo}}: {{cantidadRecursos}}</p>
											</li>	
										{{/each}}
									</ul>
								</div>
							</script>
						</div>
					</div>
					<div class="pieHolder grid_6 clearfix">
						<div class="pie" id="EuropeanaRights"></div>
						<div class="pieContent">
							<script type="text/x-handlebars-template" id="EuropeanaRightsConv">
							<div>
								<h3>Europeana Rights</h3>
									<ul>								
										{{#each this}}
											<li>
												<div class="color" style="background-color:{{color}};"></div>
												<p>{{nombreCampo}}: {{cantidadRecursos}}</p>
											</li>	
										{{/each}}
									</ul>
							</div>
							</script>							
						</div>
					</div>
				</div>
		</div>
	</section><!-- Fin de la seccion visual -->
	<div class="separator"></div>
	<section id="contentPanel">
		<div class="container_12">
			<div class="panelBajo grid_6"></div>
			<div class="panelBajo grid_3"></div>
			<div class="panelBajo grid_3" id="titulo"></div>
		</div>
		<div id="dialogo" title="Mensaje importante !!" style="display: none;"></div>
	</section><!-- Fin del panel contenido-->
	
<?php $this->load->view('footer.php'); ?>