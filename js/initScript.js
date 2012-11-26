(function($){  // variables globales
    var pies = new Array(); // para actualizar la posicion en scroll
    var ajaxRequest = false; // variable auxiliar para trabajar ajax
    var visActual; // el arbol.

		var scrollBar = (function(){
      var crear = function(contenedor){ 
        contenedor.pies.mCustomScrollbar({
          horizontalScroll:true,
          scrollButtons : {
          	enable:true,
          },
          callbacks:{
            onScroll: function(){
              if(pies){
                for (var i = 0; i < pies.length; i++) {
                    pies[i].canvas.getPos(true);
                };
              }
            },
            onTotalScroll:function(){
              if(pies){
                for (var i = 0; i < pies.length; i++) {
                  pies[i].canvas.getPos(true);
                };
              }
            }
          }
        });    
      }
      return {
        crear: crear
      }
    })();// fin del modulo ScrollBar

    var autoCompletar = (function(){
      var terminos = new Array();
      var getTerminos = function(urlTerminos){
        return $.ajax({
            url:urlTerminos,
            dataType:'json'
        });
      };
      
      var construirAutoCompletar = function(urlTerminos){
        getTerminos(urlTerminos).done(function(data){
          terminos =  $.map(data, function(element,index){
            return data[index].termNameUtf8;
          });
          $('input.inputField').autocomplete({
            source:terminos,
            minLength:2
          });
        });
      }        
      return {
        crear:construirAutoCompletar
      }       
    })();//fin del modulo autocompletar

    var piesModulo = (function(){//Modulos crear pies
      var piesMarco = $('div.pie');
      var cargarDatos = function(config){
        loadingProgress(piesMarco);
        ajaxRequest = $.ajax({
          url: config.urlBusqueda,
          data: config.searchObj || config.buscador.serialize(),
          type: 'post',
          dataType:'json'     
        }).done(function(data){
          if (config.searchObj){ // si se realiza carga de datos desde otra parte del js
            if(data.mensaje){
             config.dialogo.empty().text(data.mensaje).dialog("open");
             return;
            }
            pies =[]; 
            data.forEach(function(item){
              pies.push(crearPie(item['columna'],item['jsonPie'], item['datos']));
            });            
          }
          else{ //si se realiza la carga desde el buscador
            
            if(data.pies.mensaje){
             config.dialogo.empty().text(data.pies.mensaje).dialog("open");
             return;
            }
               
             console.log(data);
             
             //centrar el nodo del arbol, al centrarse automaticamente se cargan los pies
             //desde el evento onclic definido en el arbol
             visActual.onClick(data.termData.term_id);//aqui debe centrarce la visualización actual

            
          }
                  
        });
      } 
      var loadingProgress = function(contenedores){
        contenedores.empty().siblings('div.pieContent').children('div').remove();
        $('<div></div>',{
            class:'loadingIcon',
            
        }).appendTo(contenedores);
      }

      var crearPie = function(div,json,results){
        var Json = $.parseJSON(json);
        $('#'+div).empty();
        var Pie = new $jit.PieChart({
          injectInto: div,
          animate:true,         
          hoveredColor: '#CCCCCC',
          showLabels:false,
          resizeLabels:false,
          updateHeights:false,
          Tips:{
              enable: true,
              type:'HTML',
                onShow: function(tip, node) {                                    
                  $(tip).html('<span class="etiqueta">' + node.label + '</span>: '+node.value).css('opacity',1);              
                }   
            },
            Events:{
              enable:true,
              onClick: function(node, eventInfo, e){
              }
            }
        });

        Pie.loadJSON(Json);
        var sb = Pie.sb;    
        var convenciones = $.map(results,function(n){
          var node = sb.graph.getByName(n[div]);
          return {
            nombreCampo: n[div],
            cantidadRecursos:n['Numero'],
            color:node.getData('colorArray')[0]
          }
        });
        $('html, body').animate({scrollTop:150},500,'easeOutQuart');
        setConventions(convenciones,div);
        return Pie;
      }

      var setConventions = function(convenciones, criterio){
        var contenedor = $('div#'+criterio).siblings('div.pieContent');
        contenedor.children('div').remove();
        var plantilla = $('#'+criterio+'Conv').html();  
        var template = Handlebars.compile(plantilla),
          contenido = template(convenciones);
        contenedor.append(contenido);
        setTimeout(function(){contenedor.children('div').addClass('visible');},20);
      }

      return {
        cargarDatos: cargarDatos,
        pies: pies,
        crearPie:crearPie
      };

    })();//fin del modulo pies

    var visModulo = (function(){
      var panelTitulo = $('div#titulo');
      var cargarData = function (config){   // inicializa todas las visualizaciones      
        
        visActual = crearRgraph(dataJson); //data json son los datos del arbol importados de los ejemplos que envio el profe
        
        /*es necesario vaciar las otras visualizaciones antes de pintar una nueva
        de otra forma hay conflictos con las id de las etiquetas y no se muestran
        y entonces no hay forma de navegar los arboles*/

        $('li#hyperLink').on('click',function(){
          $('div.vis').empty();
         visActual = crearHyperTree(dataJson);
        });
        $('li#arbolLink').on('click',function(){
          $('div.vis').empty();
         visActual = crearRgraph(dataJson);
        });

      }

      var crearRgraph = function(json){
          var ht = new $jit.RGraph({  
          injectInto: 'arbol',  
          width: 780,  
          height: 480,
          background: {  
            CanvasStyles: {  
              strokeStyle: '#555'  
            }  
          },
          Node: {  
              dim: 10,  
              color: "#004080"  
          },  
          Edge: {  
              lineWidth: 2,  
              color: "#0BC0F4"  
          },
          Navigation: {  
              enable: true,  
              panning: false,  
            
          },  
          onCreateLabel: function(domElement, node){  

              domElement.innerHTML = node.name;  
              $jit.util.addEvent(domElement, 'click', function () { 
                  //node.getParents && limpiarArbol(node.getParents()[0]);
                  ht.onClick(node.id, {  
                      onComplete: function() {  
                          ht.controller.onComplete();  
                      }  
                  });  
              });  
          }, 
          onPlaceLabel: function(domElement, node){  
              var style = domElement.style;  
              style.display = '';  
              style.cursor = 'pointer';  
              if (node._depth <= 2) {  
                  style.fontSize = "0.8em";  
                  style.color = "#ddd";  
          
              }  else {  
                  style.display = 'none';  
              }         
              var left = parseInt(style.left);  
              var w = domElement.offsetWidth;  
              style.left = (left - w / 2) + 'px';  
          },
          onBeforeCompute:function(node){ 
            piesNodoArbol(node);
            console.log(node);
            panelTitulo.html("<p>"+node.name+"</p>"); // se pone el nombre del nodo en  el panel               
          },
          onAfterCompute:function(node){
            
          },
          Events:{
            enable:true,
            onClick:function(){
             //limpiarArbol(node.getParents());  
            }
          }        
        });
        ht.loadJSON(json);
        ht.refresh(); 
        return ht;
      }
      var crearHyperTree = function(json){
          var ht = new $jit.Hypertree({  
          injectInto: 'hyperArbol',  
          width: 780,  
          height: 480,
          Node: {  
              dim: 10,  
              color: "#004080"  
          },  
          Edge: {  
              lineWidth: 2,  
              color: "#0BC0F4"  
          },
          Navigation: {  
              enable: true,  
              panning: true,  
            
          },  
          onCreateLabel: function(domElement, node){
             
              domElement.innerHTML = node.name;  
              $jit.util.addEvent(domElement, 'click', function () { 
                  //node.getParents && limpiarArbol(node.getParents()[0]);
                  ht.onClick(node.id, {  
                      onComplete: function() {  
                          ht.controller.onComplete();  
                      }  
                  });  
              });  
          }, 
          onPlaceLabel: function(domElement, node){  
              var style = domElement.style;  
              style.display = '';  
              style.cursor = 'pointer';  
              if (node._depth <= 2) {  
                  style.fontSize = "0.8em";  
                  style.color = "#ddd";  
          
              }  else {  
                  style.display = 'none';  
              }         
              var left = parseInt(style.left);  
              var w = domElement.offsetWidth;  
              style.left = (left - w / 2) + 'px';  
          },
          onBeforeCompute:function(node){ 
            piesNodoArbol(node);
            console.log(node);
            panelTitulo.html("<p>"+node.name+"</p>"); // se pone el nombre del nodo en  el panel               
          },
          onAfterCompute:function(node){
            
          },
          Events:{
            enable:true,
            onClick:function(){
             //limpiarArbol(node.getParents());  
            }
          }        
        });
        ht.loadJSON(json);
        ht.refresh(); 
        return ht;
      }

      var piesNodoArbol = function (node){// carga los pies de un concepto o categoría
       
        ajaxRequest && ajaxRequest.abort();
        if(node.data.title === "is Category"){
          piesModulo.cargarDatos({
          searchObj:{id:node.id,column:"parentKey"},
          urlBusqueda:'index.php/buscador/pieArbol'
        });

        }else{

        piesModulo.cargarDatos({
          searchObj:{id:node.id,column:"term_id"},
          urlBusqueda:'index.php/buscador/pieArbol'
        });
        }        
      }

      return {
        cargarData:cargarData,
        piesNodoArbol: piesNodoArbol
      };

    })();//fin del modulo arbol


  var init = function (config){

    config.dialogo.dialog({ //dialogo modal
      autoOpen: false,
      show: "blind",
      hide: "explode",
      modal:true,
      zIndex: 9898
    });
    config.tabs.tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    config.tabs.find('li').removeClass( "ui-corner-top" )
                          .end()
                          .children('ul')
                          .removeClass('ui-corner-all')
                          .removeClass('ui-widget-header');
    config.buscador.on('submit', function(e){
      piesModulo.cargarDatos(config);
      e.preventDefault();
    });    
    config.scrollToo.on('click',function(){
      $('html, body').animate({scrollTop:0},700,'easeInBack').promise().done(function(){
        config.buscador.find('input').focus();
      });
    });
    $(window).on('scroll', function(){
      $(window).scrollTop() > 100 ? config.scrollToo.slideDown():config.scrollToo.slideUp();
    });
    config.buscador.find('input[type="text"]').on('focus',function(){
      $(this).val("");
    });

  }

    /*-------------------------------------fin modulos-------------------------------------------*/

 

    init({
      buscador:$('form#form_buscador'),
      urlBusqueda:'index.php/buscador/termino',
      scrollToo:$('div.searchTag'),
      arbol:$('form#form_arbol'),
      dialogo: $("#dialogo"),
      tabs:$('div#tabs'),
      
    });
    visModulo.cargarData({
      arbolJson:'index.php/buscador/cargarArbol',
      piesJson:'index.php/buscador/pieArbol'
    });

    autoCompletar.crear('index.php/buscador/listaTerminos'); 
     scrollBar.crear({
      pies:$(".piesContainer")      
    });

})(jQuery);