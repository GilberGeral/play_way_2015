

'use strict';
(function(){
    
    if(window.cordoba){
        document.addEventListener("deviceready",init, false);
    }else{
        window.addEventListener('load',init,false);
    }
    var canvas=null,ctx=null,canvas2=null,ctx=null;
    var scaleX=1,scaleY=1;
    var touches=[];
    var lastPress=null;
    var version=0;//version de juego. 1 full, 0 gratis
    var playerDog={};
    var borde=0;
    var ancho=0,alto=0,mAncho=0,pixelRatio=0;//marca esta relacionada con los eventos touch
    var totalObjetos=23,time=0,totalJugadores=0,maxPe=0,aLinea=0;
    var objetosCargados=0;
	var nMax=0,nMin=0,aleat=0,maxSorpresas=4;//sorpresas por cuadrante
    var frame=0,anchoBotones=0,altoBotones=0,tamanoFicha=0,radioFicha=0,aPar=0;
    var i=0,j=0,k=0;//para los for
    var dx=0,dy=0,dt=0;//para los toques y mouse eventos
    //booleanas
    var cargando=true,jugando=false,terminado=false,haySonido=true,pausado=false;
	var PI=3.14159;
	
  
    var carpeta="SD";
    var sonidosSrc="ogg";
    var sextension="",typeAudio="";
		var haySetAds=false;
    var patron,gradiente1,amarillo,azul,rojo,verde,driver;
	
    var turno=0,pasoFichas=14;//pasofichas es para contar cuantos frames antes de que la ficha se mueva en su direccion
    
   //botones
    var bContinuar,bReiniciar,bReiniciar2,bMenu,bGuardar,bPausar;
   
   
    //arrays
    var posicionesx=[];
    var posicionesy=[];
    var botonesTablero=[];
    var jugadores=[];
    var sorpresas=[];
    var frozens=[];
    var particulas=[];
    var spasos=[];
    var chispas=[];
    var finales=[];
    var sorpresasData=[];
    
    finales[0]=0;
    
    //jsons
    var dataSaved={mode:false,vida:100,alpha:1.0}
    
    var amarilloR={posx:0,posy:0,frozen:0,tipo:""}
    var azulR={posx:0,posy:0,frozen:0,tipo:""}
    var rojoR={posx:0,posy:0,frozen:0,tipo:""}
    var verdeR={posx:0,posy:0,frozen:0,tipo:""}
    var err='';
    var finalesData={a:0,b:0,c:0,d:0};
    
    //declaracion de sonidos
    var sfondo,scambia,spaso,sbien,smal,sfinal,sTapa,sTdes;
    
    //clase imagen
    function imagen(data){
        
        this.obtenerData=data;
        this.x=0;
        this.y=0;
        this.ancho=0;
        this.alto=0;
        this.medio=0;
        this.pic=new Image();
        //console.log("data "+this.obtenerData);
    }
   
    var bloqued=true;
    var bloqued2=true;
		
    var preloadedInterstitial = null;
    var ititulo=new imagen(true);
    var ipatron=new imagen(false);
    var inumeros=new imagen(true);
    var imano=new imagen(true);
    var ifin=new imagen(true);
    var ipregunta=new imagen(true);
    var iayudas=new imagen(true);
    var isorpresas=new imagen(true);
    var ibotones=new imagen(false);
    var ipausa=new imagen(true);
    var isaved=new imagen(true);
    var imenu=new imagen(true);
    var activos={verde:false,amarillo:false,azul:false,rojo:false}
    //dev
	var mousex=0;
	var mousey=0,x=0,y=0;
    var dx=0,dy=0;
    
    function dGanadores(){
       
        this.x=0;
        this.y=0;
        
    }
    
    var dPrimero=new dGanadores();
    var dSegundo=new dGanadores();
    var dTercero=new dGanadores();
    var dCuarto=new dGanadores();
    
		function rPantalla() {
	//console.log("en rpan ",ancho,alto);
	

			//dataRes.mode = false;
			var gameWidth = window.innerWidth;
			var gameHeight = window.innerHeight;
			var scaleToFitX = gameWidth/ancho ;
			var scaleToFitY =  gameHeight/alto ;

			var currentScreenRatio = gameWidth / gameHeight;
			var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
			//console.log('currenscreenratio '+currentScreenRatio);
			if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
					canvas2.style.width = gameWidth + "px";
					canvas2.style.height = gameHeight + "px";
				
					canvas2.style.left = ((gameWidth - (ancho * optimalRatio))/2)+"px";
					canvas2.style.top = ((gameHeight - (alto * optimalRatio))/2)+"px";
				
					console.log("a");
			}else {
					console.log("b");
					canvas2.style.left = ((gameWidth - (ancho * optimalRatio))/2)+"px";
					canvas2.style.top = ((gameHeight - (alto * optimalRatio))/2)+"px";
					canvas2.style.width = ancho * optimalRatio + "px";
					canvas2.style.height = alto * optimalRatio + "px";
			}
			
			scaleX = ancho/(gameWidth-(gameWidth-(ancho*optimalRatio)));
			scaleY = alto/(gameHeight-(gameHeight - (alto*optimalRatio)));
			console.log("sx "+scaleX+" sy "+scaleY);
			
			enableInputs();
		} //fin de rPantalla : redimensionar la pantalla

    function canPlayOgg(){
        var aud=new Audio();
        if(aud.canPlayType('audio/ogg').replace(/no/,'')){
            aud=null;
            return true;
        }else{
            aud=null;
            return false;
        }

    }
    
    function determinarFinales(quien,hacer){
        
        finales.push(quien);
        
        jugadores[quien].tipo="none";
        
        if(hacer != true){
            totalJugadores-=1;
            jugadores[quien].estado=6;
        }
        if(haySonido)sfinal.audio.play();
        if(totalJugadores == 1){
            
           flujo(3);
            
            //determinar quien perdio
            for(i=1;i<=4; i++){
                if(jugadores[i].tipo != "none" & jugadores[i].estado != 6){
                    //console.log("perdio el jugador "+jugadores[i].nombre);
                    finales.push(i);
                    localStorage.setItem("continuar","0");
                }
            }
            
        //console.log(finales+" jugadores "+totalJugadores);
        }else{
            driver.reset(quien);
        }
    }//fin de determinar finales posiciones
    
    function sonido(id,src,mute,loop,autoplay,preload,vol){
        
        this.id=id;
        this.audio=new Audio(src);
        this.audio.volume=0.300;
        this.audio.mute=mute;
        if(vol==null){this.audio.volume=1.0}else{this.audio.volume=vol;}
        this.audio.loop=loop;
        this.audio.autoplay=autoplay;
        this.audio.preload=preload;
        this.audio.type=typeAudio;
        this.ultimoVol=1.0;
        this.agonizando=false;
        this.reiniciando=false;
        this.audio.addEventListener('canplaytrhough',this.cargar(),false);
    }

    
    sonido.prototype.cargar=function(){objetosCargados++;} 
    
     
    function creaSonidos(){
        sTapa=new sonido(898,sextension+"/teleApa."+sextension,false,false,false,true,1.0);
        sTdes=new sonido(899,sextension+"/teleDes."+sextension,false,false,false,true,1.0);
        
        sfinal=new sonido(900,sextension+"/final."+sextension,false,false,false,true,1.0);
        sfondo=new sonido(901,sextension+"/fondo."+sextension,false,false,false,true,0.01);
        scambia=new sonido(902,sextension+"/num."+sextension,false,false,false,true,1.0);
        for(i=1;i<=4;i++){
            spasos[i]=new sonido(902+i,sextension+"/paso."+sextension,false,false,false,true,1.0);
        }
        
            smal=new sonido(910+i,sextension+"/mala."+sextension,false,false,false,true,0.5);
            sbien=new sonido(911+i,sextension+"/buena."+sextension,false,false,false,true,0.5);
        
        //if(navigator.isCocoonJS)Cocoon.Utils.markAsMusic(sextension+"/fondo."+sextension);
     }//fin de creasonidos
    
    function guardaJuego(){
        //toma todos los jugadores
        if(totalJugadores < 2)return;//evita guardar antes que termine el juego, pero cuando el penultimo esta celebrando su llegada
        amarilloR.tipo=jugadores[1].tipo;
        amarilloR.posx=jugadores[1].posx;
        amarilloR.posy=jugadores[1].posy;
        amarilloR.frozen=jugadores[1].frozen;
        
        azulR.tipo=jugadores[2].tipo;
        azulR.posx=jugadores[2].posx;
        azulR.posy=jugadores[2].posy;
        azulR.frozen=jugadores[2].frozen;
        
        rojoR.tipo=jugadores[3].tipo;
        rojoR.posx=jugadores[3].posx;
        rojoR.posy=jugadores[3].posy;
        rojoR.frozen=jugadores[3].frozen;
        
        verdeR.tipo=jugadores[4].tipo;
        verdeR.posx=jugadores[4].posx;
        verdeR.posy=jugadores[4].posy;
        verdeR.frozen=jugadores[4].frozen;
        
        localStorage.setItem('amarilloSaved', JSON.stringify(amarilloR));
        localStorage.setItem('azulSaved', JSON.stringify(azulR));
        localStorage.setItem('rojoSaved', JSON.stringify(rojoR));
        localStorage.setItem('verdeSaved', JSON.stringify(verdeR));
        
        localStorage.setItem('turno', String(turno));
        localStorage.setItem('recuperar', "1");
        localStorage.setItem('continuar', "0");
        
        for(i=1;i<=maxSorpresas*4;i++){
            sorpresasData[i]={x:sorpresas[i].x,y:sorpresas[i].y,mode:sorpresas[i].mode,tipo:sorpresas[i].tipo}
            localStorage.setItem('sorpresaData'+i, JSON.stringify(sorpresasData[i]));
        }
        if(finales[1] != null){
            finalesData.a=finales[1];
        }
        if(finales[2] != null){
            finalesData.b=finales[2];
        }
        if(finales[3] != null){
            finalesData.c=finales[3];
        }
        if(finales[4] != null){
            finalesData.d=finales[4];
        }
        localStorage.setItem('finalesData', JSON.stringify(finalesData));
        
    }
    
    
    function iniciaSonidos(){
        
        if(localStorage.getItem("sonido")==null){
            localStorage.setItem("sonido","1");
            haySonido=true;
            bSonido.cortex=0;
        }else if(localStorage.getItem("sonido")=="0"){
            haySonido=false;
            
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.300;
            sfondo.audio.play();
            sfondo.audio.muted=true;
        }else if(localStorage.getItem("sonido")=="1"){
            //inicie el sonido de fondo
            haySonido=true;
            
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.300;
            sfondo.audio.play();
        }
        
       //console.log(sfondo.audio.volume);
    }//fin de inicia sonidos
    
    function creaBotones(){
        
        driver=new controlador();
        //los 5 botones de control de flujo el juego
        
        bPausar=new boton(ipausa.x,ipausa.y,ipausa.ancho,ipausa.alto,0,0,ipausa.pic);
        bReiniciar=new boton(mAncho-(imenu.medio),(alto/100)*35,anchoBotones,altoBotones,0,5,imenu.pic);
        bContinuar=new boton(mAncho-(imenu.medio),(alto/100)*20,anchoBotones,altoBotones,0,0,imenu.pic);
        bGuardar=new boton(mAncho-(imenu.medio),(alto/100)*50,anchoBotones,altoBotones,0,7,imenu.pic);
        bMenu=new boton(mAncho-(imenu.medio),(alto/100)*65,anchoBotones,altoBotones,0,6,imenu.pic);
        
        bReiniciar2=new boton(mAncho-(imenu.medio),(alto/100)*80,anchoBotones,altoBotones,0,8,imenu.pic);
        
        dPrimero.x=mAncho-(imenu.medio);
        dPrimero.y=(alto/100)*5;
        
        dSegundo.x=mAncho-(imenu.medio);
        dSegundo.y=(alto/100)*20;
        
        dTercero.x=mAncho-(imenu.medio);
        dTercero.y=(alto/100)*35;
        
        dCuarto.x=mAncho-(imenu.medio);
        dCuarto.y=(alto/100)*50;
        
    }
    
    function switchAudio(){
		console.log("al sonido : "+haySonido);
        switch(haySonido){
            case true:
                localStorage.setItem("sonido","0");
                haySonido=false;
                sfondo.audio.muted=true;
				sfondo.audio.volume=0.0;
                bSonido.cortex=1;
            break;
            case false:
                localStorage.setItem("sonido","1");
                haySonido=true;
                sfondo.audio.muted=false;
				sfondo.audio.volume=0.5;
                bSonido.cortex=0;
            break;
        }
    }
    
    function random(min, max){
		nMax = max;
		nMin = min;
		aleat=Math.floor(Math.random()*(nMax-(nMin-1))) + nMin;
        return aleat;
		}
    
    function frozen(){
        this.x=0;
        this.y=0;
        this.quien=0;
        this.sumador=0;
        this.mode=false;
        this.posx=0;
        this.posy=0;
        this.apareciendo=false;
        this.cx=8;
        this.alpha=1.0;
        if(carpeta=="HD"){
            this.ancho=75;
            this.ancho2=37;
        }else if(carpeta=="SD"){
            this.ancho=50;
            this.ancho2=25;
        }
        
    }//fin de la clase frozen
    
    frozen.prototype.existir=function(){
        if(!this.mode)return;
        this.sumador++;
        if(this.sumador > random(100,120)){
            this.sumador=0;
            this.cx=random(0,8);
        }
        if(this.apareciendo){
            this.alpha+=0.005;
            if(this.alpha > 1.0){
                this.alpha=1.0;
                this.apareciendo=false;
            }
        }else{
            this.alpha-=0.005;
            if(this.alpha < 0.4){
                this.alpha=0.4;
                this.apareciendo=true;
            }
        }
    }//fin de existir de frozen
    
    frozen.prototype.pintar=function(){
        
       if(!this.mode)return;
       // console.log("p");
         ctx.fillStyle="rgba(0,200,255,"+this.alpha+")";
        
        ctx.beginPath();
        ctx.arc(posicionesx[this.x],posicionesy[this.y],radioFicha,0,Math.PI*2,true);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle="rgba(255,255,255,1)";
ctx.drawImage(isorpresas.pic,this.cx*this.ancho,0,this.ancho,this.ancho,(posicionesx[this.x])-this.ancho2,(posicionesy[this.y])-this.ancho2,this.ancho,this.ancho);
    }
                      
    function lanzaFrozen(quien,au){
        console.log("llego a lanzafrozen");
            if(au != "a"){if(haySonido)smal.audio.play();}
            frozens[quien].mode=true;
            frozens[quien].x=jugadores[quien].posx;
            frozens[quien].y=jugadores[quien].posy;
            frozens[quien].apareciendo=true;
            frozens[quien].cx=8;
            frozens[quien].vida=100;
            frozens[quien].quien=quien;
            jugadores[quien].dataTitulo.mode=true;
            jugadores[quien].dataTitulo.cy=0;
            //console.log("debio lanzar frozen en x : "+frozens[quien].x);
            
        
    }
    
    function sorpresa(x,y,id){
        
        this.id=500+id;
        this.mode=true;
        this.tipo=random(1,5);
        /*
        1: congelamiento
        2: teletransporte x positivo;
        3: teletransporte x negativo;
        4: teletransporte y positivo;
        5: teletransporte y negativo;
        6: +1 turno;
        */
        //this.tipo=1;
        this.x=x;
        this.y=y;
        
        this.alpha=0.80;
        this.bajando=true;//para controlar el alpha
        if(carpeta=="HD"){
            this.ancho=32;
        }else if(carpeta=="SD"){
            this.ancho=16;
        }
    }
    
   
    sorpresa.prototype.repetidas=function(){
			/*
        for(i=1;i<=maxSorpresas*4;i++){
            if(this.id != sorpresas[i].id & sorpresas[i].mode){
                //averiguo si esta en mi misma posicion
                if(this.x == sorpresas[i].x & this.y == sorpresas[i].y){
                    sorpresas[i].mode=false;
                    console.log("se borro por repetida la sorpresa id "+i);
                }
            }
        }
				*/
    }
    
    sorpresa.prototype.existir=function(){
        //cambiar el alpha de cada una
        if(!this.mode)return;
        if(this.bajando){
           this.alpha-=0.05;
            if(this.alpha < 0.0){
                this.alpha=0.0;
                this.bajando=false;
            }
        }else{
            this.alpha+=0.005;
            if(this.alpha > 0.80){
                this.alpha=0.80;
                this.bajando=true;
            }
        }
    }
    
    sorpresa.prototype.pintar=function(){
      if(!this.mode)return;
        
        ctx.fillStyle="rgba(255,255,255,"+this.alpha+")";
        
        ctx.beginPath();
        ctx.arc(posicionesx[this.x],posicionesy[this.y],radioFicha,0,Math.PI*2,true);
        ctx.fill();
        ctx.closePath();
        
        ctx.drawImage(ipregunta.pic,(posicionesx[this.x])-this.ancho,(posicionesy[this.y])-this.ancho);
        
        /*
        ctx.fillStyle="rgba(255,255,0,1)";
        ctx.font="30Px Arial";
        ctx.fillText(this.id,posicionesx[this.x]+10,posicionesy[this.y]);
        */
        
    }
    
    //animacion de avance
	function particula(){
		this.color="";
		this.alpha=1.0;
		this.vida=0;
		this.mode=false;
		this.x=0;
		this.y=0;
		this.radio=0.0;
        this.radioR=0;
	}
	
	particula.prototype.existir=function(){
	
		if(!this.mode)return;
		this.vida-=1;
		
		if(this.vida > 0){
			this.alpha-=0.01;
			this.radio-=0.4;
            if(this.radio < 5.0){
                this.radio=5.0;
                
            }
            this.radioR=~~(this.radio);
		}else{
			this.mode=false;
			
		}
	}
	
	particula.prototype.pintar=function(){
	
		if(!this.mode)return;
		ctx.beginPath();
		//ctx.fillStyle="rgba("+this.color+","+this.alpha+")";
		ctx.fillStyle="rgba("+this.color+","+this.alpha+")";
		
		ctx.arc(posicionesx[this.x],posicionesy[this.y],this.radioR,0,Math.PI*2,true);
		
		ctx.fill();
		ctx.closePath();
		
	}
	
	
	function lParticulas(quien){
		
		for(i=1;i<=4;i++){
			if(!particulas[i].mode){
				if(bloqued2 == false){
					if(haySonido)spasos[i].audio.play();
				}
					
        
				particulas[i].mode=true;
				particulas[i].x=jugadores[quien].posx;
				particulas[i].y=jugadores[quien].posy;
				particulas[i].color=jugadores[quien].color;
				particulas[i].radio=radioFicha;
				particulas[i].vida=50;
				particulas[i].alpha=1.0;
                //console.log("lanzo la part : "+i);
				return;
			}
		}
	}
    
    function titulof(){
        this.x=0;
        this.y=0;
        this.cy=0;
        this.mode=false;
        this.vida=100;
        this.alpha=1.0;
        this.ancho=0;
        this.alto=0;
        this.ocultar=false;
    
    }
    
    function teleTransport(id){
        
        
        this.id=id;
        this.vida=0;
        this.xfin=0;
        this.yfin=0;
        this.empezando=true;
        this.mode=false;
        this.cx=0;
    }
    
    function IA(id){
        
        this.id=id;
        this.azar=0;
        this.azar2=0;
        this.elegido=false;
        
        this.xPos=0;//aqui va el id del boton correspondiente a esa direccion de ESE jugador
        this.xNeg=0;
        this.yPos=0;
        this.yNeg=0;
        
        this.xPosHis=5;//0: normal, 1: otro jugador, 2: una sorpresa
        this.xNegHis=5;
        this.yPosHis=5;
        this.yNegHis=5;
        
        this.xPosTrunc=false;//fue truncada esa posicion ?
        this.xNegTrunc=false;
        this.yPosTrunc=false;
        this.yNegTrunc=false;
        
        this.xPosScore=0;//aqui va el puntaje obtenido para cada posible direccion a elegir
        this.xNegScore=0;
        this.yPosScore=0;
        this.yNegScore=0;
        
        this.pensando=50;
    }//fin de la clase IA
    
    IA.prototype.azarPositivos=function(){
        
        if(this.xPos == 0)return this.yPos;
        if(this.yPos == 0)return this.xPos;
        
        this.azar=random(1,2);
        if(this.azar == 1){
            return this.xPos;
        }else{
            return this.yPos;
        }
    }//fin de azar positivos
    
    IA.prototype.azarNegativos=function(){
        
        if(this.xNeg == 0)return this.yNeg;
        if(this.yNeg == 0)return this.xNeg;
        
        this.azar=random(1,2);
        if(this.azar == 1){
            return this.xNeg;
        }else{
            return this.yNeg;
        }
    }//fin de azar negativos
    
    IA.prototype.elegir=function(cual2,linea){
        //console.log("la llamada fue de la linea "+linea);
        
        //console.log("se eligio direccion, se recibio el boton "+cual2);
        
        if(cual2 != null){
            this.elegido=true;
            jugadores[this.id].direccion=botonesTablero[cual2].direccion;
            jugadores[this.id].estado=1;
        }else{
           // console.log("No se recibio un destino valido");
        }
    }//fin de elegir 
    
    IA.prototype.negative=function(){
        //este analiza las opciones negativas
        //SOLO cuando el avance es de una unidad
        
        
        if(this.xNeg != 0 & this.yNeg != 0 & !this.elegido){
           
            //las dos pocisiones negativas estan disponibles
            if(this.xNegHis == this.yNegHis){
                //hay lo mismo en cada una de esas posiciones
                //otro jugador, una sorpresa o nada
                if(this.xNegHis == 1){
                    //en ambos hay un jugador
                    this.elegir(this.azarNegativos(),1);
                }else{
                    this.elegir(this.azarPositivos(),2);
                }
                
            }else{
                //si estan activas las dos pociones negativas
                //pero hay cosas distitas en cada una de ellas
                if(this.xNegHis == 1 | this.yNegHis == 1 & !this.elegido){
                    //en alguna de ellas hay otro jugador ?
                    //escojo la que tenga UN jugador
                    if(this.xNegHis == 1){
                        
                        this.elegir(this.xNeg,3);
                        
                    }else if(this.yNegHis == 1){
                        
                        this.elegir(this.yNeg,4);
                        
                    }
                    
                }else if(this.xNegHis != 1 & this.yNegHis != 1 & !this.elegido){
                    //en ninguna de las dos hay un jugador
                    //NO me devuelvo NI por sorpresa 
                    //NI cuando no hay nada en esas posiciones
                    this.elegir(this.azarPositivos(),5);
                }
                
            }
            
        }else if(this.xNeg == 0 & this.yNeg == 0 & !this.elegido){
            //aqui se lanza la primer jugada
            //y SI le da por volver al punto inicial
            this.elegir(this.azarPositivos(),6);
            
        }else if(this.xNeg == 0 | this.yNeg == 0 & !this.elegido){
            //no solo esta disponible una de las 2
            //averiguamos si es negx
             //console.log("llego aqui");
            if(this.xNeg != 0 & !this.elegido){
                if(this.xNegHis == 1){
                    this.elegir(this.xNeg,7);
                }else if(this.xNegHis != 1){
                    this.elegir(this.azarPositivos(),8);
                }
            }
            
            //averiguamos si es negy
            if(this.yNeg != 0 & !this.elegido){
                if(this.yNegHis == 1){
                    this.elegir(this.yNeg,9);
                }else if(this.yNegHis != 1){
                    this.elegir(this.azarPositivos(),10);
                }
            }
            
        }
        
    }//fin de analizar negativos
    
    IA.prototype.queHay=function(){
        /*
        averigua que hay en cada boton de destino 
        posible para elegir
        */
        //preguntar por la posicion de  los otros jugadores
        //console.log(jugadores[this.id].nombre+" llego a que hay ");
        for(i=1;i<=4;i++){
            if(jugadores[i].id != this.id & jugadores[i].tipo != "none"){
                //cada uno de los 4 botones
               // console.log("debio entrar aqui "+i);
                if(this.xPos != 0){
                    if(posicionesx[jugadores[i].posx] == botonesTablero[this.xPos].x & posicionesy[jugadores[i].posy] == botonesTablero[this.xPos].y){
                        //console.log(jugadores[this.id].nombre+" y en mi x positivo esta "+jugadores[i].nombre);
                        this.xPosHis=1;
                    }
                }
                if(this.xNeg != 0){
                    if(posicionesx[jugadores[i].posx] == botonesTablero[this.xNeg].x & posicionesy[jugadores[i].posy] == botonesTablero[this.xNeg].y){
                        //console.log(jugadores[this.id].nombre+" y en mi x negativo esta "+jugadores[i].nombre);
                        this.xNegHis=1;
                    }
                }
                if(this.yPos != 0){
                    if(posicionesx[jugadores[i].posx] == botonesTablero[this.yPos].x & posicionesy[jugadores[i].posy] == botonesTablero[this.yPos].y){
                        //console.log(jugadores[this.id].nombre+" y en mi y positivo esta "+jugadores[i].nombre);
                        this.yPosHis=1;
                    }
                }
                if(this.yNeg != 0){
                    if(posicionesx[jugadores[i].posx] == botonesTablero[this.yNeg].x & posicionesy[jugadores[i].posy] == botonesTablero[this.yNeg].y){
                        //console.log(jugadores[this.id].nombre+" y en mi y negativo esta "+jugadores[i].nombre);
                        this.yNegHis=1;
                    }
                }
                
            }//fin de recorrer solo los no none y no yo mismo
            
        }//fin del for que recorre todos los jugadores
        
        for(i=1;i<=maxSorpresas*4;i++){//recorrer todas las sorpresas
            
            if(sorpresas[i].mode){
                
                if(this.xPos != 0){
                    if(posicionesx[sorpresas[i].x] == botonesTablero[this.xPos].x & posicionesy[sorpresas[i].y] == botonesTablero[this.xPos].y){
                        //console.log("soy "+jugadores[this.id].nombre+" y en mi x positivo esta la sorpresa "+sorpresas[i].id);
                        this.xPosHis=2;
                    }
                }
                if(this.xNeg != 0){
                    if(posicionesx[sorpresas[i].x] == botonesTablero[this.xNeg].x & posicionesy[sorpresas[i].y] == botonesTablero[this.xNeg].y){
                        //console.log("soy "+jugadores[this.id].nombre+" y en mi x negativo esta la sorpresa "+sorpresas[i].id);
                        this.xNegHis=2;
                    }
                }
                if(this.yPos != 0){
                    if(posicionesx[sorpresas[i].x] == botonesTablero[this.yPos].x & posicionesy[sorpresas[i].y] == botonesTablero[this.yPos].y){
                        //console.log("soy "+jugadores[this.id].nombre+" y en mi y positivo esta la sorpresa "+sorpresas[i].id);
                        this.yPosHis=2;
                    }
                }
                if(this.yNeg != 0){
                    if(posicionesx[sorpresas[i].x] == botonesTablero[this.yNeg].x & posicionesy[sorpresas[i].y] == botonesTablero[this.yNeg].y){
                        //console.log("soy "+jugadores[this.id].nombre+" y en mi y negativo esta la sorpresa "+sorpresas[i].id);
                        this.yNegHis=2;
                    }
                }
                
            }//fin de solo las activas
            
        }//fin del for que reccorre todas las sorpresas
        
        
    }//fin del metodo que hay
    
    IA.prototype.seleccionar=function(){
        /*
        escencia de la inteligencia rtificialk
        */
        if(jugadores[this.id].avanzar == 1){
            //avanzo solo uno, contemplo devolverme
            if(this.xPos != 0 & this.yPos != 0 & !this.elegido){
                //las 2 opciones positivas estan habilitadas
                if(this.xPosHis == this.yPosHis & !this.elegido){
                    //hay lo mismo en ambas posiciones positivas
                    //que puede ser otro jugador (1), una sorpresa (2) o nada (3)
                    if(this.xPosHis == 1 & !this.elegido){
                        //hay otro jugador en ambas posiciones positivas
                        //seleccionar azar en los positivos
                        this.elegir(this.azarPositivos(),11);
                    }else if(this.xPosHis != 1 & !this.elegido){
                        //hay una sorpresa o NADA  en cada positivo
                        
                        this.negative();
                        
                    }
                    
                }else if(this.xPosHis != this.yPosHis & !this.elegido){
                    //ambas posiciones positivas estan habilitadas
                    //pero hay cosas direfentes en cada una de ellas
                    
                    //entonces pregunto si hay un jugador en cualquiera de las dos
                    if(this.xPosHis == 1 | this.yPosHis == 1 & !this.elegido){
                        //escojo al que valga uno
                        if(this.xPosHis == 1 & !this.elegido){
                            this.elegir(this.xPos,12);
                        }
                        if(this.yPosHis == 1 & !this.elegido){
                            this.elegir(this.yPos,13);
                        }
                        
                    }else if(this.xPosHis != 1 & this.yPosHis != 1 & !this.elegido){
                        //no, NO hay NINGUN jugador en cualquiera de las dos positivas
                        //recuerdo que el avance es de uno
                        this.negative();
                        
                    }
                    
                }
                
            }else if(this.xPos == 0 | this.yPos == 0 & !this.elegido){
                //alguna de las dos opciones positivas NO esta activa
                //significa que ya llego a algun extremo
                
                //pregunto por posx
                if(this.xPos != 0 & !this.elegido){
                    //pregunto si hay un jugador
                    //si NO lo hay, evaluo negativos
                    if(this.xPosHis == 1 & !this.elegido){
                        this.elegir(this.xPos,14);
                    }else if(this.xPosHis != 1 & !this.elegido){
                        this.negative();
                    }
                //pregunto por posy
                }else if(this.yPos != 0 & !this.elegido){
                    if(this.yPosHis == 1 & !this.elegido){
                        this.elegir(this.yPos,15);
                    }else if(this.yPosHis != 1 & !this.elegido){
                        this.negative();
                    }
                }
                
                
            }//aqui sigue un imposible
            
            
        }else if(jugadores[this.id].avanzar > 1){
            //avanzo mas de una posicion
            //NO me devuelvo ni por el putas
            if(this.xPos != 0 & this.yPos != 0 ){
                //si los dos positivos son diferentes de cero
                //pregunto si hay lo mismo en cada destino
                if(this.xPosHis == this.yPosHis & !this.elegido){
                    //hay lo mismo
                    //preguntamos por el truncado
                    //ambos fueron truncados ?
                    if(this.xPosTrunc & this.yPosTrunc & !this.elegido){
                        //escoja al azar entre los positivos
                        this.elegir(this.azarPositivos(),16);
                    }else if(!this.xPosTrunc & !this.yPosTrunc & !this.elegido){
                        //ninguno fue truncado
                        this.elegir(this.azarPositivos(),17);
                    }else if(this.xPosTrunc | this.yPosTrunc & !this.elegido){
                        //alguno de los dos fue truncado
                        //escojo al que NO fue truncado
                        if(this.xPosTrunc & !this.elegido){
                            this.elegir(this.yPos,18);
                        }else if(this.yPosTrunc & !this.elegido){
                            this.elegir(this.xPos,19);
                        }
                    }
                    
                }else if(this.xPosHis != this.yPosHis & !this.elegido){
                    //NO hay lo mismo es las positivas, pero ambas estan activas
                    //pregunto si en alguna hay un jugador
                   
                    if(this.xPosHis == 1 | this.yPosHis == 1 & !this.elegido){
                        //eliga a la que tenga un jugador
                        if(this.xPosHis == 1 & !this.elegido){
                            this.elegir(this.xPos,20);
                        }else if(this.yPosHis == 1 & !this.elegido){
                            this.elegir(this.yPos,21);
                        }
                    }else if(this.xPosHis != 1 & this.yPosHis != 1 & !this.elegido){
                        //ninguna de las positivas tiene a un jugador en su destino
                         //console.log("debio entra aqui en error");
                        //si ambas son iguales
                        if(this.xPosTrunc == this.yPosTrunc & !this.elegido){
                            this.elegir(this.azarPositivos(),22);
                        }else if(this.xPosTrunc != this.yPosTrunc & !this.elegido){
                            //si alguna fue truncada
                            //escoja la otra
                            if(this.xPosTrunc & !this.elegido){
                                this.elegir(this.yPos,23);
                            }else if(this.yPosTrunc & !this.elegido){
                                this.elegir(this.xPos,24);
                            }
                        }
                        
                    }
                    
                    
                }//fin de son diferentes los destinos
                
                
            }else if(this.xPos == 0 | this.yPos == 0 ){
                //alguno de los dos positivos es cero
                //entonces ya llego a un extremo
                if(this.xPos != 0 & !this.elegido){
                    //elegir xpos
                    this.elegir(this.xPos,25);
                }else if(this.yPos != 0 & !this.elegido){
                    this.elegir(this.yPos,26);
                }
            }
            
        }
        
       if(this.elegido){
            for(i=1;i<=280;i++)botonesTablero[i].mode=false;
        } 
    }//fin del metodo seleccionar de la IA
    
    IA.prototype.reset=function(){
        this.xPos=0;//aqui va el id del boton correspondiente a esa direccion de ESE jugador
        this.xNeg=0;
        this.yPos=0;
        this.yNeg=0;
        
        this.xPosHis=5;//0: normal, 1: otro jugador, 2: una sorpresa
        this.xNegHis=5;
        this.yPosHis=5;
        this.yNegHis=5;
        
        this.xPosTrunc=false;//fue truncada esa posicion ?
        this.xNegTrunc=false;
        this.yPosTrunc=false;
        this.yNegTrunc=false;
        this.elegido=false;
        
        this.xPosScore=0;//aqui va el puntaje obtenido para cada posible direccion a elegir
        this.xNegScore=0;
        this.yPosScore=0;
        this.yNegScore=0;
        this.pensando=random(40,60);
        //console.log("me resetee IA de "+jugadores[this.id].nombre);
    }
    
    function chispa(){
		this.mode=false;
		
		this.duracion=0;
		this.radio=20;
		this.x=0;
		this.y=0;
        this.color="";
		this.transparencia=1.00;
		this.particula=[];
		for(var i=1; i<=maxPe;i++){
			this.particula[i]={x:0,y:0,inix:0,iniy:0,vx:0,vy:0,ancho:4,r:0,g:0,b:0,a:1.0}
		}
	}//fin de la clase chispa
    
    chispa.prototype.existir=function(){
		
		if(this.duracion > 0){
            this.duracion-=1;
			for(var i=1; i<=maxPe;i++){
			
				this.particula[i].x+=(this.particula[i].vx);
				this.particula[i].y+=(this.particula[i].vy);
				/*
				if(this.particula[i].r > 0){this.particula[i].r-=5;}else{this.particula[i].r=0;}
				if(this.particula[i].g > 0){this.particula[i].g-=5;}else{this.particula[i].g=0;}
				if(this.particula[i].b > 0){this.particula[i].b-=5;}else{this.particula[i].b=0;}
				*/
				if(this.particula[i].a > 0.0){this.particula[i].a-=0.02;}else{this.particula[i].a=0.0;}
				
				this.particula[i].ancho=2;
                
			}
			
		}else{
			this.mode=false;
		}
    }
    
    chispa.prototype.pintar=function(){
	
				
		for(i=1; i<=maxPe;i++){
			//ctx.fillStyle="rgba("+this.particula[i].r+","+this.particula[i].g+","+this.particula[i].b+","+this.particula[i].a+")";
			ctx.fillStyle="rgba("+this.color+","+this.particula[i].a+")";
            ctx.beginPath();
			ctx.fillRect(this.particula[i].x,this.particula[i].y,aPar,aPar);
			ctx.fill();
			ctx.closePath();
		}
		
    } 
    
    function lanzaChispas(dx,dy,quien){
        //if(quienL==quien)return;//evitar q una bala pida chispas 2 veces
        
        //console.log("llego a lanzar explosion"+dx+","+dy);
	   for(i=1;i<=4;i++){
		if(!chispas[i].mode){
			chispas[i].mode=true;
			chispas[i].x=dx-(aPar/2);
			chispas[i].color=jugadores[quien].color;
			chispas[i].y=dy-(aPar/2);
			chispas[i].duracion=random(10,15);
			
			
			for(j=1; j<=maxPe;j++){
				
				chispas[i].particula[j]={x:dx,y:dy,inix:dx,iniy:dy,vx:random(-10,10),vy:random(-10,10),r:10,g:255,b:20,a:1.0}
			}
			break;
		}
	   }
        
    }//fin de lanzachispas
    
    function jugador(px,py,modo,radio,color,tipo,dx,dy,turno,id){
        
        this.id=id;//1:amarillo,2:azul,3:rojo,4:verde
        this.posx=px;
        this.posy=py;
        this.mode=modo;
        this.radio=radio;
        this.radio2=~~(this.radio/2);
        this.tipo=tipo;
        
        this.turno=turno;
        this.direccion=0;//1 adelante; 2:atras, 3:arriba, 4:abajo, 0:sin direccion
        this.nombre="";
        this.color=color;
        this.avanzar=0;
        
        this.turno=turno;
        this.turnoExtra=0;
        this.desx=dx;
        this.desy=dy;
        this.inix=this.posx;
        this.iniy=this.posy;
        this.dirPasos={arr:0,aba:0,ade:0,atr:0};
        this.dataCel={vida:40}
        this.paso=pasoFichas;
        this.adelante=0;
        this.atras=0;
        this.arriba=0;
        this.abajo=0;
        this.frozen=0;
        this.pasosTel=0;
        
        this.cuadrante={};
        switch(this.id){
            case 1:
                 this.cuadrante={xini:1,xfin:7,yini:1,yfin:10}
                 this.nombre="amarillo";
             break;
            case 2:
                this.cuadrante={xini:8,xfin:14,yini:1,yfin:10}
                this.nombre="azul";
            break;
            case 3:
                this.cuadrante={xini:1,xfin:7,yini:11,yfin:20}
                this.nombre="rojo";
            break;
            case 4:
                this.cuadrante={xini:8,xfin:14,yini:11,yfin:20}
                this.nombre="verde";
            break;
        }
        
       
        this.estado=0;
        this.dataTitulo=new titulof();
        this.teletransport=new teleTransport();
        //console.log(this);
        
        
        //refernte a la IA
        
        this.IA=new IA(this.id);   
        
        
    }//fin de la clase jugador
    
    jugador.prototype.existir=function(){
        
        
        if(this.tipo=="none" & turno==this.turno){
            driver.reset(this.id);
            //return;
        }
        
        if(this.tipo=="none")return;
        
        if(this.dataTitulo.mode & this.dataTitulo.ocultar){
                //console.log("jugador existir : gestiona su titulo OK");
                this.dataTitulo.vida-=1;
                if(this.dataTitulo.vida < 1){
                   //console.log("jugador existir : cerro su titulo ");
                    this.dataTitulo.vida=100;
                    this.dataTitulo.mode=false;
                    this.dataTitulo.ocultar=false;
                    
                }
            }
        
        if(this.estado == 0)return;
        
        
                
        if(this.estado==1 & this.tipo != "none" & turno==this.turno){
            /*

            en este estado la ficha se mueve segun su direccion y cantidad de posiciones
            al terminar pasa a estado : 2 indiscriminadamente

            */
            switch(this.direccion){
                case 1:
                    this.paso-=1;
                        if(this.paso < 1){                 
                            if(this.dirPasos.ade > 0){
                                lParticulas(this.turno);
                                this.posx+=1;
                                this.dirPasos.ade-=1;

                            }else if(this.dirPasos.ade < 1){
                                //termino de moverse
                                this.estado=2;
                            }

                            this.paso=pasoFichas;
                        }

                break;//fin de adelante
                case 2:
                    this.paso-=1;
                    if(this.paso < 1){                 
                        if(this.dirPasos.atr > 0){
                            lParticulas(this.turno);
                            this.posx-=1;
                            this.dirPasos.atr-=1;

                        }else if(this.dirPasos.atr < 1){
                            //termino de moverse
                            this.estado=2;
                        }
                        this.paso=pasoFichas;
                    }
                break;//fin de atras
                case 3:
                    this.paso-=1;
                    if(this.paso < 1){              
                        if(this.dirPasos.arr > 0){
                            lParticulas(this.turno);
                            this.posy-=1;
                             
                            this.dirPasos.arr-=1;

                        }else if(this.dirPasos.arr < 1){
                            //termino de moverse
                            this.estado=2;
                        }

                        this.paso=pasoFichas;
                    }
                break;//fin de arriba
                case 4:
                    this.paso-=1;
                        if(this.paso < 1){                
                            if(this.dirPasos.aba > 0){
                                lParticulas(this.turno);
                                this.posy+=1;
                                
                                this.dirPasos.aba-=1;

                            }else if(this.dirPasos.aba < 1){
                                //termino de moverse
                                this.estado=2;
                            }
                            this.paso=pasoFichas;
                        }
                break;//fin de abajo

            }


        }//fin de estado 1

        if(this.estado==2 & this.tipo != "none" & turno==this.turno){
            /*
            en este estado se pregunta si ya termino de jugar, si ya llego a su destino
            falta politica al respecto sobre celebracion
            
            */
            //console.log(this.nombre+" mi estado es 2 "+this.desx+" "+this.desy);
            //console.log(this.nombre+" mi x e y "+this.posx+" "+this.posy);
            if(this.posx == this.desx & this.posy == this.desy){
                
                //console.log("termine de jugar mi posicion es "+this.nombre);
               // 
                this.estado=6;
            }
            if(this.estado==2)this.estado=3;
        }//fin de estado 2

        if(this.estado==3 & this.tipo != "none" & turno==this.turno){
            
            /*
             en este estado se pregunta si YA habia un jugador en la posicion a la que llego la fcha
            */
            
            for(i=1;i<=4;i++){
                if(this.id != i & jugadores[i].tipo != "none"){
                    //reviso la posicion de los demas jugadores
                    if(this.posx == jugadores[i].posx & this.posy == jugadores[i].posy){//preguntar si ya hay un jugador ahi
                        //console.log(this.nombre+" me encontre con la ficha "+jugadores[i].nombre);
                        this.turnoExtra=1;
                        this.estado=0;
                        driver.reset(this.id);
                        this.dataTitulo.mode=true;
                        this.dataTitulo.cy=3;
                        this.dataTitulo.ocultar=true;
                        if(haySonido)sbien.audio.play();
                        break;
                    }

                    if(this.estado==3)this.estado=4;
                    
                }//fin de evito preguntar por mi mismo
            }//fin de recorrerlos todos
            
             
         }//fin de estado 3 

        if(this.estado==4 & this.tipo != "none" & turno==this.turno){
             /*
             este es el estado 4
             aqui se pregunta si en la posicion actual hay alguna sorpresa
             console.log("soy el jugador "+this.nombre+" y mi estado es 3");
             */


             for(j=1;j<=maxSorpresas*4;j++){

               if(sorpresas[j].mode){//solo las activas

                   if(this.posx == sorpresas[j].x & this.posy == sorpresas[j].y){//preguntar si una sorpresa ahi

                    //console.log(this.nombre+" me encontre con la sorpresa "+sorpresas[j].id);
                       sorpresas[j].mode=false;
                       switch(sorpresas[j].tipo){
                            case 1:
                                lanzaFrozen(this.turno);
                                this.frozen=1;
                                this.estado=0;
                                driver.reset(this.id);
                                
                            break;
                            case 2://teletrans x positivo
                               //console.log("soy "+this.nombre+" y me teletransporte positivo en x, mi destino en x "+this.desx);
                               this.pasosTel=random(1,4);
                               if(this.desx == 14 ){
                                   this.teletransport.xfin=this.posx+this.pasosTel;
                                   if(this.teletransport.xfin > 14)this.teletransport.xfin=14;
                                   this.teletransport.yfin=this.posy;
                               }else if(this.desx == 1){
                                   this.teletransport.xfin=this.posx-this.pasosTel;
                                   if(this.teletransport.xfin < 1)this.teletransport.xfin=1;
                                   this.teletransport.yfin=this.posy;
                               }
                               this.teletransport.mode=true;
                               this.dataTitulo.mode=true;
                               this.dataTitulo.ocultar=true;
                               this.dataTitulo.cy=1;
                               if(haySonido)sTdes.audio.play();
                               this.estado=5;
                               
                            break;
                            case 3:
                               //teletrans  x negativo
                               
                               //console.log("soy "+this.nombre+" y me teletransporte negativo en x, mi destino en x "+this.desx);
                               this.pasosTel=random(1,4);
                               if(this.desx == 14 ){
                                   this.teletransport.xfin=this.posx-this.pasosTel;
                                   if(this.teletransport.xfin < 1)this.teletransport.xfin=1;
                                   this.teletransport.yfin=this.posy;
                               }else if(this.desx == 1){
                                   this.teletransport.xfin=this.posx+this.pasosTel;
                                   if(this.teletransport.xfin > 14)this.teletransport.xfin=14;
                                   this.teletransport.yfin=this.posy;
                               }
                               this.teletransport.mode=true;
                               this.dataTitulo.mode=true;
                               this.dataTitulo.ocultar=true;
                               this.dataTitulo.cy=2;
                               if(haySonido)sTdes.audio.play();
                               this.estado=5;
                            break;
                            case 4:
                               //teletrans y positivo
                              //console.log("soy "+this.nombre+" y me teletransporte positivo en y, mi destino en y "+this.desy);
                               this.pasosTel=random(1,4);
                               if(this.desy == 1 ){
                                   this.teletransport.yfin=this.posy-this.pasosTel;
                                   if(this.teletransport.yfin < 1)this.teletransport.yfin=1;
                                   this.teletransport.xfin=this.posx;
                               }else if(this.desy == 20){
                                   this.teletransport.yfin=this.posy+this.pasosTel;
                                   if(this.teletransport.yfin > 20)this.teletransport.yfin=20;
                                   this.teletransport.xfin=this.posx;
                               }
                               
                               this.teletransport.mode=true;
                               this.dataTitulo.mode=true;
                               this.dataTitulo.ocultar=true;
                               this.dataTitulo.cy=1;
                               if(haySonido)sTdes.audio.play();
                               this.estado=5;
                            break;
                            case 5:
                               //teletrans y negativo
                               
                               // console.log("soy "+this.nombre+" y me teletransporte negativo en y, mi destino en y "+this.desy);
                               this.pasosTel=random(1,4);
                               if(this.desy == 1 ){
                                   this.teletransport.yfin=this.posy+this.pasosTel;
                                   if(this.teletransport.yfin > 20)this.teletransport.yfin=20;
                                   this.teletransport.xfin=this.posx;
                               }else if(this.desy == 20){
                                   this.teletransport.yfin=this.posy-this.pasosTel;
                                   if(this.teletransport.yfin < 1)this.teletransport.yfin=1;
                                   this.teletransport.xfin=this.posx;
                               }
                               
                               this.teletransport.mode=true;
                               this.dataTitulo.mode=true;
                               this.dataTitulo.ocultar=true;
                               this.dataTitulo.cy=2;
                               if(haySonido)sTdes.audio.play();
                               this.estado=5;
                            break;

                       }//fin de switch
                       break;

                    }//fin de SI hay una sorpresa

               }//fin de solo las activas

            }//fin de recorrer todas las sorpresas

            //entrego el turno por que NO me encontre nada en mi nueva posicion
            if(this.estado == 4){
                driver.reset(this.id);
            }

         }//fin de estado 4
        
        if(this.estado==5 & this.tipo != "none" & turno==this.turno){
            /*
            en este estado se getiona el teletransporte
            */
            //console.log(this.nombre+" me estoy teletransportando");
            if(this.teletransport.mode){
                if(this.teletransport.empezando){
                    this.teletransport.vida+=3;
                    this.teletransport.cx=~~(this.teletransport.vida/10);
                    
                    if(this.teletransport.vida > 96){
                        this.teletransport.empezando=false;
                        this.posx=this.teletransport.xfin;
                        this.posy=this.teletransport.yfin;
                        if(haySonido)sTapa.audio.play();
                    }
                }else{
                    this.teletransport.vida-=3;
                    this.teletransport.cx=~~(this.teletransport.vida/10);
                    
                    if(this.teletransport.vida < 4 ){
                        this.teletransport.empezando=true;
                        this.teletransport.mode=false;
                        
                        this.estado=2;//volver a buscar en la posicion a la que llegue despues de teletransportarme
                        //driver.reset(this.id);
                    }
                }
                
                
            }
            
        }//fin del estado 5, teletrans
        
        
        if(this.estado==6 & this.tipo != "none" & turno==this.turno){
            /*en este estado se celebra el haber ganado, se determina la posicion en las finales y se pasa 
            el turno de ser necesario
            
            */
            //console.log("he ganado");
            this.dataCel.vida-=1;
            switch(this.dataCel.vida){
                case 39:
                    lanzaChispas(posicionesx[this.posx],posicionesy[this.posy],this.turno);
                break;
                case 29:
                    lanzaChispas(posicionesx[this.posx],posicionesy[this.posy],this.turno);
                break;
                case 19:
                    lanzaChispas(posicionesx[this.posx],posicionesy[this.posy],this.turno);
                break;
                case 9:
                    lanzaChispas(posicionesx[this.posx],posicionesy[this.posy],this.turno);
                break;
                    
            }//fin del swicth
            
            if(this.dataCel.vida < 1){
                determinarFinales(this.id);
            }
        }//fin de estado 6
    
        if(this.estado==7 & this.tipo == "system" & turno==this.turno){
           // console.log("soy la IA de "+this.nombre);
            if(this.IA.pensando > 1){
              this.IA.pensando-=1;  
            }else if(this.IA.pensando == 1){
                this.IA.seleccionar();
                this.IA.pensando=0;
            }
        }
    }//fin del metodo existir
    
    jugador.prototype.habilitar=function(){
        //habilita los botones de movimiento a su alrededor
        //habilitar superior, si es posible
        //console.log("soy "+this.nombre+" y mi py es "+this.posy);
        
        if(this.posy > 1){//habilitar y negativo del tablero 
            
            this.arriba=this.posy-this.avanzar;
            if(this.arriba<1){
                this.arriba=1;
                switch(this.id){
                    case 1:
                        this.IA.yPosTrunc=true;
                        
                    break;
                    case 2:
                        this.IA.yPosTrunc=true;
                        
                    break;
                    case 3:
                        this.IA.yNegTrunc=true;
                        
                    break;
                    case 4:
                        this.IA.yNegTrunc=true;
                        
                    break;
                }
            
            }
                for(i=1;i<=280;i++){
                    if(posicionesx[this.posx]==botonesTablero[i].x &  posicionesy[this.arriba]==botonesTablero[i].y){
                        botonesTablero[i].mode=true;
                        botonesTablero[i].direccion=3;
                        this.dirPasos.arr=this.posy-this.arriba;
                        switch(this.id){
                            case 1:
                                this.IA.yPos=i;
                            break;
                            case 2:
                                this.IA.yPos=i;
                            break;
                            case 3:
                                this.IA.yNeg=i;
                            break;
                            case 4:
                                this.IA.yNeg=i;
                            break;
                        }
                    break;
                    }
                }
           
                
        }//fin de habilitar y negativo
        
        if(this.posx < 14){//habilitar x positivo del tablero
            this.adelante=this.posx+this.avanzar;
            if(this.adelante > 14){
                this.adelante=14;
                switch(this.id){
                            case 1:
                                this.IA.xNegTrunc=true;
                                
                            break;
                            case 2:
                                this.IA.xPosTrunc=true;
                                
                            break;
                            case 3:
                                this.IA.xNegTrunc=true;
                                
                            break;
                            case 4:
                                this.IA.xPosTrunc=true;
                                
                            break;
                        }
            }
                for(i=1;i<=280;i++){
                    if(posicionesx[this.adelante]==botonesTablero[i].x &  posicionesy[this.posy]==botonesTablero[i].y){
                        botonesTablero[i].mode=true;
                        botonesTablero[i].direccion=1;
                        this.dirPasos.ade=this.adelante-this.posx;
                        switch(this.id){
                            case 1:
                                this.IA.xNeg=i;
                            break;
                            case 2:
                                this.IA.xPos=i;
                            break;
                            case 3:
                                this.IA.xNeg=i;
                            break;
                            case 4:
                                this.IA.xPos=i;
                            break;
                        }
                        
                    break;
                    }
                }
            
        }//fin de habilitar x positivo 
        
        if(this.posx > 1){//habilitar x negativo del tablero
            this.atras=this.posx-this.avanzar;
            if(this.atras < 1){
                this.atras=1;
                switch(this.id){
                    case 1:
                        this.IA.xPosTrunc=true;
                        
                    break;
                    case 2:
                        this.IA.xNegTrunc=true;
                        
                    break;
                    case 3:
                        this.IA.xPosTrunc=true;
                        
                    break;
                    case 4:
                        this.IA.xNegTrunc=true;
                        
                    break;
                }
            }
            for(i=1;i<=280;i++){
                    if(posicionesx[this.atras]==botonesTablero[i].x &  posicionesy[this.posy]==botonesTablero[i].y){
                        botonesTablero[i].mode=true;
                        botonesTablero[i].direccion=2;
                        this.dirPasos.atr=this.posx-this.atras;
                        switch(this.id){
                            case 1:
                                this.IA.xPos=i;
                            break;
                            case 2:
                                this.IA.xNeg=i;
                            break;
                            case 3:
                                this.IA.xPos=i;
                            break;
                            case 4:
                                this.IA.xNeg=i;
                            break;
                        }
                    break;
                    }
            }
        }//fin de habilitar x negativo
        
        if(this.posy < 20){//habilitar y positivo del tablero
            this.abajo=this.posy+this.avanzar;
            if(this.abajo > 20){
                this.abajo=20;
                switch(this.id){
                    case 1:
                        this.IA.yNegTrunc=true;
                    break;
                    case 2:
                        this.IA.yNegTrunc=true;
                    break;
                    case 3:
                        this.IA.yPosTrunc=true;
                    break;
                    case 4:
                        this.IA.yPosTrunc=true;
                    break;
                }
            }
            for(i=1;i<=280;i++){
                    if(posicionesx[this.posx]==botonesTablero[i].x &  posicionesy[this.abajo]==botonesTablero[i].y){
                        botonesTablero[i].mode=true;
                        botonesTablero[i].direccion=4;
                        this.dirPasos.aba=this.abajo-this.posy;
                        switch(this.id){
                            case 1:
                                this.IA.yNeg=i;
                            break;
                            case 2:
                                this.IA.yNeg=i;
                            break;
                            case 3:
                                this.IA.yPos=i;
                            break;
                            case 4:
                                this.IA.yPos=i;
                            break;
                        }
                    break;
                    }
                }
        }//fin de habilitar y positivo
        
        if(this.tipo=="system"){
            /*
            console.log(this.nombre+" mi x positivo es "+this.IA.xPos);
            console.log(this.nombre+" mi x negativo es "+this.IA.xNeg);
            console.log(this.nombre+" mi y positivo es "+this.IA.yPos);
            console.log(this.nombre+" mi y negativo es "+this.IA.yNeg);
            */
            this.IA.queHay();
            this.estado=7;
        }
    }//fin de habilitar botones
    
    jugador.prototype.pintar=function(){
        
        if(this.tipo=="none")return;
        
        
        if(this.frozen==0 & !this.teletransport.mode){
            ctx.fillStyle="rgba("+this.color+",1)";
            ctx.beginPath();
            ctx.arc(posicionesx[this.posx],posicionesy[this.posy],this.radio,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle="rgba(0,0,0,0.5)";
            ctx.arc(posicionesx[this.posx],posicionesy[this.posy],this.radio2,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();
        }
        if(this.teletransport.mode){
            
            ctx.drawImage(isorpresas.pic,
                          this.teletransport.cx*tamanoFicha,
                          1*tamanoFicha,
                          tamanoFicha,
                          tamanoFicha,
                          (posicionesx[this.posx])-(this.radio),
                          (posicionesy[this.posy])-(this.radio),
                          tamanoFicha,
                          tamanoFicha);
           
        }
        
       if(this.dataTitulo.mode){
         ctx.drawImage(iayudas.pic,0,
                          this.dataTitulo.cy*this.dataTitulo.alto,
                          this.dataTitulo.ancho,
                          this.dataTitulo.alto,
                          this.dataTitulo.x,
                          this.dataTitulo.y,
                          this.dataTitulo.ancho,
                          this.dataTitulo.alto);  
        }
       
    }//fin del metodo pintar
    
    function pasarTurno(){
        turno+=1;
        if(turno > 4)turno=1;
    }
    
    function controlador(){
        this.turno=0;
        this.mode=true;
        this.sumador=0;
        this.limite=150;
        this.eligiendo=false;
        
        this.tipo="";
        this.restadorTipo=random(20,40);
        this.ancho=~~(inumeros.pic.width/10);
        this.alto=inumeros.pic.height;
        this.mx=(ancho/2)-(~~(this.ancho/2));
        this.my=(alto/2)-(~~(this.alto/2));
        this.cantidad=0;
        
        this.manoancho=~~(imano.pic.width/4);
        this.manoalto=~~(imano.pic.height);
        this.mostrarMano=false;
        
        this.boton=new botonRedondo(ancho/2,alto/2,tamanoFicha*2,"",true);
        
        if(carpeta=="HD"){
            this.borde=7;
        }else if(carpeta="SD"){
            this.borde=5;
        }
    }
    
    controlador.prototype.existir=function(){
        
        if(!this.mode)return;
        
        if(jugadores[turno].frozen > 0){
            
            jugadores[turno].frozen=0;
            jugadores[turno].estado=0;
            jugadores[turno].dataTitulo.mode=false;
            frozens[turno].mode=false;
            if(haySonido)sbien.audio.play();
            driver.reset(turno);
        }
       
        if(jugadores[turno].frozen > 0)return;
        
        this.boton.color=jugadores[turno].color;
        this.tipo=jugadores[turno].tipo;
        
        
        
        if(!this.eligiendo){
            if(this.boton.touch() & this.tipo=="human"){
                touches[0]=null;
                this.eligiendo=true;
                
            }
            if(this.tipo=="system"){
                this.restadorTipo-=1;
                
                this.mostrarMano=true;
                
                if(this.restadorTipo < 0){
                    this.mostrarMano=false;
                    this.restadorTipo=random(20,40);
                    this.eligiendo=true;
                }
            }
        }else{
            //animacion de numeros
            this.sumador++;
            this.limite-=1;
            //console.log(this.limite);
            if(this.sumador==10 & this.limite > 30){
                
                this.cantidad=random(1,4);
                this.sumador=0;
                if(haySonido)scambia.audio.play();
                this.boton.alpha=0.800;
                this.boton.radio+=random(2,4);
                //reproducir sonido de dado golpeando
            }
            if(this.limite < 0){
               //if(this.tipo=="system")this.cantidad=1;//hacer que se mueva por obligacion solo una unidad
                jugadores[turno].avanzar=this.cantidad;
                jugadores[turno].habilitar();
                this.mode=false;
                
            }
            
        }//fin de la animacion de los numeros
        
        
    }//fin de existir de driver
    
    controlador.prototype.reset=function(cual){
        //esta SI cambia el turno
        jugadores[cual].estado=0;
        jugadores[cual].IA.reset();
        this.mode=true;
        this.eligiendo=false;
        this.limite=150;
        this.sumador=0;
        this.boton.radio=tamanoFicha*2;
        //cambiar de turno
        //console.log("reset "+turno);
        pasarTurno();
        
        for(i=1;i<=4;i++){
           if(jugadores[i].turnoExtra == 1){
              // console.log("debio entrar aqui");
              turno=jugadores[i].turno;
              jugadores[i].turnoExtra=0;
               //celebracion doble turno
               
           } 
        }
        //console.log("el turno es de "+jugadores[turno].nombre);
    }//fin de reset
   
    
    controlador.prototype.pintar=function(){
        if(!this.mode)return;
        //console.log("s "+this.boton.color);
        this.boton.pintar();
        
        if(this.eligiendo){
            ctx.drawImage(inumeros.pic,this.cantidad*this.ancho,0,this.ancho,this.alto,this.mx,this.my,this.ancho,this.alto);
        }
        if(this.mostrarMano){
            ctx.drawImage(imano.pic,(turno-1)*this.manoancho,0,this.manoancho,this.manoalto,this.mx+50,this.my,this.manoancho,this.manoalto);
        }
    }
    
    function fondo(){
        var sumadorT=0;
        var borde=0;
        activos={verde:false,amarillo:false,azul:false,rojo:false}
        ctx.fillStyle="rgb(131,255,82)";
        ctx.fillRect(0,0,ancho,alto);
        //amarillo
        ctx.beginPath();
        ctx.fillStyle="rgb(255,255,0)";
        ctx.fillRect(0,0,ancho/2,alto/2);
		ctx.fill();
		//azul
		ctx.fillStyle="rgb(0,0,255)";
        ctx.fillRect(ancho/2,0,ancho/2,alto/2);
		ctx.fill();
		//rojo
		ctx.fillStyle="rgb(255,0,0)";
        ctx.fillRect(0,alto/2,ancho/2,alto/2);
		ctx.fill();
		//verde
		ctx.fillStyle="rgb(30,123,30)";
        ctx.fillRect(ancho/2,alto/2,ancho/2,alto/2);
		ctx.fill();
		ctx.closePath();
        
        patron=ctx.createPattern(ipatron.pic,'repeat');
        
        ctx.strokeStyle="rgba(224,107,3,1)";
       
        ctx.fillStyle=patron;
        
        
        
        if(carpeta=="HD"){
            
            borde=3;
            ctx.fillRect(15,210,ancho-30,alto-420);
            ctx.fill();
            
            ctx.globalAlpha=0.03;
            ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
            ctx.globalAlpha=1.0;
            
            ctx.lineWidth=3;
            
            for(i=1;i<=14;i++){
                ctx.beginPath();
                ctx.moveTo((i*tamanoFicha)+15,210);
                ctx.lineTo((i*tamanoFicha)+15,alto-210);
                ctx.stroke();
                ctx.closePath();
                
                posicionesx[i]=((i*tamanoFicha)+15)-38;
            }
           
            for(i=1;i<=20;i++){
                ctx.beginPath();
                ctx.moveTo(15,(i*tamanoFicha)+210);
                ctx.lineTo(ancho-15,(i*tamanoFicha)+210);
                ctx.stroke();
                ctx.closePath();
                
                posicionesy[i]=((i*tamanoFicha)+210)-38;
            }
            ctx.strokeStyle="rgba(0,0,0,1)";
            ctx.lineWidth=7;
            ctx.beginPath();
            ctx.strokeRect(12,207,ancho-27,alto-416);
            ctx.stroke();
           
            ctx.closePath();
            
            
        }else if(carpeta=="SD"){
            
            borde=2;
            ctx.lineWidth=2;
            ctx.fillRect(10,140,ancho-20,alto-280);
            ctx.fill();
            
            ctx.globalAlpha=0.03;
            ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
            ctx.globalAlpha=1.0;
            
            for(i=1;i<=14;i++){
                ctx.beginPath();
                ctx.moveTo((i*tamanoFicha)+10,140);
                ctx.lineTo((i*tamanoFicha)+10,alto-140);
                ctx.stroke();
                ctx.closePath();
                
                posicionesx[i]=((i*tamanoFicha)+10)-25;
            }
           
            for(i=1;i<=20;i++){
                ctx.beginPath();
                ctx.moveTo(10,(i*tamanoFicha)+140);
                ctx.lineTo(ancho-10,(i*tamanoFicha)+140);
                ctx.stroke();
                ctx.closePath();
                
                 posicionesy[i]=((i*tamanoFicha)+140)-25;
            }
            
            ctx.lineWidth=5;
            ctx.beginPath();
            ctx.strokeRect(8,138,ancho-18,alto-278);
            ctx.stroke();
            ctx.closePath();
            
            
            
        }
        
        if(localStorage.getItem("amarillo")!="none"){
            ctx.beginPath();
            ctx.fillStyle="rgba(255,255,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[1],posicionesy[1],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[1]-radioFicha,posicionesy[1]-radioFicha);
						activos.amarillo=true;
        }else{
					activos.amarillo=false;
				}
        if(localStorage.getItem("azul")!="none"){
            ctx.beginPath();
            ctx.fillStyle="rgba(0,0,255,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[14],posicionesy[1],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[14]-radioFicha,posicionesy[1]-radioFicha);
						activos.azul=true;
        }else{
					activos.azul=false;
				}
        if(localStorage.getItem("rojo")!="none"){
            ctx.beginPath();
            ctx.fillStyle="rgba(255,0,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[1],posicionesy[20],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[1]-radioFicha,posicionesy[20]-radioFicha);
						activos.rojo=true;
        }else{
					activos.rojo=false;
				}
        if(localStorage.getItem("verde")!="none"){
            ctx.beginPath();
            ctx.fillStyle="rgba(0,128,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[14],posicionesy[20],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[14]-radioFicha,posicionesy[20]-radioFicha);
						activos.verde=true;
        }else{
						activos.verde=false;
				}
        
            //botones del tablero
            for(i=1;i<=14;i++){
                for(j=1;j<=20;j++){
                    sumadorT++;
                    botonesTablero[sumadorT]=new botonRedondo(posicionesx[i],posicionesy[j],radioFicha,"0,222,255",false,sumadorT,borde);
                }
            }
        //sorpresas del tablero
        
            
            for(i=1;i<=maxSorpresas;i++){

                do{
                    dx=random(jugadores[1].cuadrante.xini,jugadores[1].cuadrante.xfin);
                    dy=random(jugadores[1].cuadrante.yini,jugadores[1].cuadrante.yfin);
                    sorpresas[i]=new sorpresa(dx,dy,i);
                }while(sorpresas[i].x != dx & sorpresas[i].y != dy);
            }

            for(i=5;i<=maxSorpresas*2;i++){

                do{
                    dx=random(jugadores[2].cuadrante.xini,jugadores[2].cuadrante.xfin);
                    dy=random(jugadores[2].cuadrante.yini,jugadores[2].cuadrante.yfin);
                    sorpresas[i]=new sorpresa(dx,dy,i);
                }while(sorpresas[i].x != dx & sorpresas[i].y != dy);
            }

            for(i=9;i<=maxSorpresas*3;i++){

                do{
                    dx=random(jugadores[3].cuadrante.xini,jugadores[3].cuadrante.xfin);
                    dy=random(jugadores[3].cuadrante.yini,jugadores[3].cuadrante.yfin);
                    sorpresas[i]=new sorpresa(dx,dy,i);
                }while(sorpresas[i].x != dx & sorpresas[i].y != dy);
            }
            for(i=13;i<=maxSorpresas*4;i++){

                do{
                    dx=random(jugadores[4].cuadrante.xini,jugadores[4].cuadrante.xfin);
                    dy=random(jugadores[4].cuadrante.yini,jugadores[4].cuadrante.yfin);
                    sorpresas[i]=new sorpresa(dx,dy,i);
                }while(sorpresas[i].x != dx & sorpresas[i].y != dy);
            }

             //elimine las sorpresas que estan repetidas, deje solo una
            for(i=1;i<=maxSorpresas*4;i++)sorpresas[i].repetidas();

            //elimine las sorpresas que estan en los botones de arranque, (y fin)
            for(i=1;i<=maxSorpresas*4;i++){

                if(sorpresas[i].x==1 &  sorpresas[i].y==1)sorpresas[i].mode=false;
                if(sorpresas[i].x==14 &  sorpresas[i].y==1)sorpresas[i].mode=false;
                if(sorpresas[i].x==1 &  sorpresas[i].y==20)sorpresas[i].mode=false;
                if(sorpresas[i].x==14 &  sorpresas[i].y==20)sorpresas[i].mode=false;
                //if(!sorpresas[i].mode)console.log("se quito la sorpresa "+i+" por estar en una esquina ");

            }
            if(localStorage.getItem("continuar") == "1"){
            //carge las sorpresas del la memoria persistente
            localStorage.setItem("continuar","0");

                for(i=1;i<=maxSorpresas*4;i++){
                    sorpresasData[i]=JSON.parse(localStorage.getItem(String("sorpresaData"+i)));
                    sorpresas[i].x=sorpresasData[i].x;
                    sorpresas[i].y=sorpresasData[i].y;
                    sorpresas[i].tipo=sorpresasData[i].tipo;
                    sorpresas[i].mode=sorpresasData[i].mode;
                }
                
                finalesData=JSON.parse(localStorage.getItem("finalesData"));
                if(finalesData.a != 0)determinarFinales(parseInt(finalesData.a),true);
                if(finalesData.b != 0)determinarFinales(parseInt(finalesData.b),true);
                if(finalesData.c != 0)determinarFinales(parseInt(finalesData.c),true);
                if(finalesData.d != 0)determinarFinales(parseInt(finalesData.d),true);
                /*
                console.log("asi quedaron las finales cargadas");
                console.log(finales);
                console.log("---------------");
                */
                for(i=1;i<=4;i++){
                    if(jugadores[i].tipo != "none"){
                        if(jugadores[i].frozen == 1){
                            lanzaFrozen(i,"a");
                        }
                        
                    }
                 }

            }//fin de recuperar sorpresas de la memoria
        
        for(i=1;i<=4;i++){

                if(jugadores[i].tipo != "none")totalJugadores+=1;
                //console.log(jugadores[i].nombre+" soy tipo "+jugadores[i].tipo);
            }
         
        //console.log("total Jugadores : "+totalJugadores);
       // botonesTablero[50].mode=true;
        // borde=null;
        // sumadorT=null;
        // gradiente1=null;
        //ititulo=null;
        //ahora crear las fichas
        
        
        
    }//fin de fondo
    
    function goTo(donde){
		if(navigator.isCocoonJS){
		      Cocoon.App.load(donde);
		}else{
			window.location=donde;
			
		}
        
    }
    //ads
    
    function flujo(hacer){
        switch(hacer){
            case 1:
                //jugar
                jugando=true;
                pausado=false;
                cargando=false;
            break;
            case 2:
                //pausar
                jugando=false;
                pausado=true;             
                cargando=false;
            break;
            case 3:
                //terminar
                jugando=false;
                pausado=false;
                terminado=true;
                cargando=false;
            break;
            case 4:
                //guardar
                
            break;
        }
    }
    
		function verAds(){
			if (typeof gdsdk !== 'undefined' && gdsdk.showBanner !== 'undefined') {
        gdsdk.showBanner();
			}
		}
    
		function bloquear(){
			console.log("desbloqueo");
			sfondo.audio.volume=0.4;
			bloqued2=false;
			bloqued=false;
		}
	
	window["GD_OPTIONS"] = {
		"gameId": "043fde736c864fe88372261fc2732bc9",
		"prefix": "awesome__", // Set your own prefix in case you get id conflicts.
    "advertisementSettings": {
        "debug": false, // Enable IMA SDK debugging.
        "autoplay": false, // Don't use this because of browser video autoplay restrictions.
        "locale": "en", // Locale used in IMA SDK, this will localise the "Skip ad after x seconds" phrases.
    },		
		"onEvent": function(event) {
			switch (event.name) {
				case "SDK_GAME_START":
						// advertisement done, resume game logic and unmute audio
						console.log("start");
						
						
						break;
				case "SDK_GAME_PAUSE":
						// pause game logic / mute audio
						console.log("pause");
						
						break;
				case "SDK_GDPR_TRACKING":
						// this event is triggered when your user doesn't want to be tracked
						console.log(89);
						
				break;
				case "SDK_GDPR_TARGETING":
						// this event is triggered when your user doesn't want personalised targeting of ads and such
					console.log(90);
					
				break;
				case "COMPLETE":
					console.log(91);
					
				break;
				case "AD_SDK_FINISHED":
					console.log(92);
					
				break;
			}
		},
	}
	
	function init(){
		setTimeout(bloquear,12000);
     
				
        pixelRatio=window.devicePixelRatio || 1;
        
       if((window.innerHeight*pixelRatio) > 1281){
            carpeta="HD";
            ancho=1080;
            mAncho=540;
            alto=1920;
            tamanoFicha=75;
            radioFicha=35;
           pasoFichas=14;
           maxPe=30;
           aPar=12;
            aLinea=5;
        }else{
            carpeta="SD";
            ancho=720;
            mAncho=360;
            alto=1280;
            tamanoFicha=50;
            radioFicha=23;
            pasoFichas=10;
            maxPe=20;
            aPar=10;
            aLinea=3;
        }
        
        
        console.log("modo : "+carpeta+", ancho : "+window.innerWidth+", alto : "+window.innerHeight);
        scaleX=(ancho/screen.availWidth);
				scaleY=(alto/(screen.availHeight-64));
        
        canvas=document.getElementById('canvas');
		ctx=canvas.getContext('2d',{antialias:false});
		canvas.width=ancho;
        canvas.height=alto;
	if(navigator.platform=="Win32"){canvas.style.position='fixed';}else{canvas.style.position='static';}
		//canvas.style.position='absolute';
		canvas.style.backgroundColor='#000';
		canvas.style.top='0';
        canvas.style.left='0';
        canvas.style.width=(screen.availWidth-0)+'px';
        canvas.style.height=(screen.availHeight-64)+'px';
		canvas.style.zIndex="10";
		
	//capa de escenrio de fondo
	canvas2=document.getElementById('esce');ctx=canvas2.getContext('2d',{antialias:false});
	canvas2.width=ancho;
    canvas2.height=alto;
    
	
	if(navigator.platform=="Win32"){canvas2.style.position='fixed';}else{canvas2.style.position='static';}
		//canvas2.style.position='absolute';
		canvas2.style.backgroundColor='#000';
		canvas2.style.top='0';
        canvas2.style.left='0';
        canvas2.style.width=(screen.availWidth-0)+'px';
        canvas2.style.height=(screen.availHeight-64)+'px';
		canvas2.style.zIndex="0";
		
        if (navigator.isCocoonJS) {
           canvas.style.position='absolute';
           canvas2.style.position='absolute';
        }
        
        if(canPlayOgg()){
            sextension="ogg";
            typeAudio="audio/ogg";
        }else{
            sextension="mp3";
            typeAudio="audio/mpeg";
        }
       
        
        //jugadores[1]=new jugador(14,20,true,radioFicha,"255,255,0",localStorage.getItem("amarillo"),1,1,1,1);
        jugadores[1]=new jugador(14,20,true,radioFicha,"255,255,0",localStorage.getItem("amarillo"),1,1,1,1);
        jugadores[2]=new jugador(1,20,true,radioFicha,"0,0,255",localStorage.getItem("azul"),14,1,2,2);
        jugadores[3]=new jugador(14,1,true,radioFicha,"255,0,0",localStorage.getItem("rojo"),1,20,3,3);
        jugadores[4]=new jugador(1,1,true,radioFicha,"0,128,0",localStorage.getItem("verde"),14,20,4,4);
        
        if(localStorage.getItem("continuar") == "1"){
            //cargar un juego que estaba guardado
            //recuperar al amarillo
            
            amarilloR = JSON.parse(localStorage.getItem('amarilloSaved'));
            jugadores[1].posx=amarilloR.posx;
            jugadores[1].posy=amarilloR.posy;
            jugadores[1].tipo=amarilloR.tipo;
            jugadores[1].frozen=amarilloR.frozen;
            
            azulR = JSON.parse(localStorage.getItem('azulSaved'));
            jugadores[2].posx=azulR.posx;
            jugadores[2].posy=azulR.posy;
            jugadores[2].tipo=azulR.tipo;
            jugadores[2].frozen=azulR.frozen;
            
            rojoR = JSON.parse(localStorage.getItem('rojoSaved'));
            jugadores[3].posx=rojoR.posx;
            jugadores[3].posy=rojoR.posy;
            jugadores[3].tipo=rojoR.tipo;
            jugadores[3].frozen=rojoR.frozen;
            
            verdeR = JSON.parse(localStorage.getItem('verdeSaved'));
            jugadores[4].posx=verdeR.posx;
            jugadores[4].posy=verdeR.posy;
            jugadores[4].tipo=verdeR.tipo;
            jugadores[4].frozen=verdeR.frozen;
            
            //cambiar los tipos human, maquina y none
            //por seguridad
            /*
            localStorage.setItem("amarillo",jugadores[1].tipo);
            localStorage.setItem("azul",jugadores[2].tipo);
            localStorage.setItem("rojo",jugadores[3].tipo);
            localStorage.setItem("verde",jugadores[4].tipo);
            */
            turno=parseInt(localStorage.getItem("turno"));
            
        }
        /*
        jugadores[1]=new jugador(13,2,true,radioFicha,"255,255,0",localStorage.getItem("amarillo"),1,1,1,1);
        jugadores[2]=new jugador(12,4,true,radioFicha,"0,0,255",localStorage.getItem("azul"),14,1,2,2);
        jugadores[3]=new jugador(14,1,true,radioFicha,"255,0,0",localStorage.getItem("rojo"),1,20,3,3);
        jugadores[4]=new jugador(14,3,true,radioFicha,"0,128,0",localStorage.getItem("verde"),14,20,4,4);
        
        jugadores[1].posx=1;
        jugadores[1].posy=2;
        
        */
        
        
        //-------------carga de imagenes
        ititulo.pic.onload=function(){
            objetosCargados++;
            if(ititulo.obtenerData){
                ititulo.x=(ancho/2)-(this.width/2);
                ititulo.y=(alto/2)-(this.height/2);
            }
        }
        ititulo.pic.src=carpeta+"/logoGrandeS.png";
        
        ipatron.pic.onload=function(){
            objetosCargados++;
            if(ipatron.obtenerData){
                ipatron.x=(ancho/2)-(this.width/2);
                ipatron.y=(alto/10)-(this.height/2);
            }
        }
        ipatron.pic.src=carpeta+"/madera.png";
        
        ibotones.pic.onload=function(){
            objetosCargados++;
            if(ibotones.obtenerData){
                ibotones.x=(ancho/2)-(this.width/2);
                ibotones.y=(alto/10)-(this.height/2);
            }
        }
        ibotones.pic.src=carpeta+"/bDirecciones.png";
        
        inumeros.pic.onload=function(){
            objetosCargados++;
            if(inumeros.obtenerData){
                inumeros.x=(ancho/2)-(this.width/2);
                inumeros.y=(alto/2)-(this.height/2);
            }
        }
        inumeros.pic.src=carpeta+"/numeros.png";
        
        imano.pic.onload=function(){
            objetosCargados++;
            if(imano.obtenerData){
                imano.x=(ancho/2)-(this.width/2);
                imano.y=(alto/2)-(this.height/2);
            }
        }
        imano.pic.src=carpeta+"/mano.png";
        
        ifin.pic.onload=function(){
            objetosCargados++;
            if(ifin.obtenerData){
                ifin.x=(ancho/2)-(this.width/2);
                ifin.y=(alto/2)-(this.height/2);
            }
        }
        ifin.pic.src=carpeta+"/fin.png";
        
        ipregunta.pic.onload=function(){
            objetosCargados++;
            if(ipregunta.obtenerData){
                ipregunta.x=(ancho/2)-(this.width/2);
                ipregunta.y=(alto/2)-(this.height/2);
                
            }
        }
        ipregunta.pic.src=carpeta+"/pregunta.png";
        
        iayudas.pic.onload=function(){
            objetosCargados++;
            if(iayudas.obtenerData){
                
                jugadores[1].dataTitulo.x=0;
                jugadores[1].dataTitulo.y=60;
                jugadores[1].dataTitulo.ancho=this.width;
                jugadores[1].dataTitulo.alto=~~(this.height/4);
                
                jugadores[2].dataTitulo.x=ancho/2;
                jugadores[2].dataTitulo.y=60;
                jugadores[2].dataTitulo.ancho=this.width;
                jugadores[2].dataTitulo.alto=~~(this.height/4);
                
                jugadores[3].dataTitulo.x=0;
                jugadores[3].dataTitulo.y=~~((alto-60)-(this.height/4));
                jugadores[3].dataTitulo.ancho=this.width;
                jugadores[3].dataTitulo.alto=~~(this.height/4);
                
                jugadores[4].dataTitulo.x=ancho/2;
                jugadores[4].dataTitulo.y=~~((alto-60)-(this.height/4));
                jugadores[4].dataTitulo.ancho=this.width;
                jugadores[4].dataTitulo.alto=~~(this.height/4);
                
            }
        }
        iayudas.pic.src=carpeta+"/ayudas.png";
        
        
        isorpresas.pic.onload=function(){
            objetosCargados++;
            if(isorpresas.obtenerData){
                isorpresas.ancho=~~(this.width/10);
                isorpresas.alto=~~(this.height/2);
            }
        }
        isorpresas.pic.src=carpeta+"/sorpresas.png";
        
        ipausa.pic.onload=function(){
            objetosCargados++;
            if(ipausa.obtenerData){
                ipausa.ancho=~~(this.width);
                ipausa.alto=~~(this.height);
                ipausa.medio=~~(this.width/2);
                ipausa.x=~~((ancho/2)-ipausa.medio);
                //ipausa.y=alto-(this.height);
                ipausa.y=0;
            }
        }
        ipausa.pic.src=carpeta+"/pause.png";
        
        isaved.pic.onload=function(){
            objetosCargados++;
            if(isaved.obtenerData){
                isaved.ancho=~~(this.width);
                isaved.alto=~~(this.height);
                isaved.medio=~~(this.width/2);
                isaved.x=~~((ancho)-isaved.ancho);
                isaved.y=0;
            }
        }
        isaved.pic.src=carpeta+"/saved.png";
        
        imenu.pic.onload=function(){
            objetosCargados++;
            if(imenu.obtenerData){
                anchoBotones=this.width;
                altoBotones=~~((this.height)/9);
                imenu.medio=~~(anchoBotones/2);
            }
        }
        imenu.pic.src=carpeta+"/menuJugando.png";
        
        
        
        
        for(i=1;i<=4;i++)frozens[i]=new frozen();
        for(i=1;i<=4;i++)particulas[i]=new particula();
        for(i=1;i<=4;i++){chispas[i]=new chispa();}
        
        creaSonidos();
				rPantalla();
        enableInputs();
				
        run();
    }//fin de init()

    function run(){
        requestAnimationFrame(run);
        /*
        var now=Date.now();
        var deltaTime=now-time;
        if(deltaTime>1000)deltaTime=0;
        time=now;
        */
        act();
        paint();
    }

    function act(){
       
			 
        if(cargando){
            if(objetosCargados==totalObjetos){
                
                creaBotones();
                iniciaSonidos();
                fondo();
               
                if(turno==0)turno=random(1,4);
								
								verAds();
								flujo(1);
								
								
                //turno=1;
            }else{
                //todavia cargando
            }
        }//fin de cargando
        
				if(bloqued){
				 
				 return;
			 }
        if(jugando){//jugando de act
            frame++;
            
            if(haySonido){
                if(sfondo.audio.volume < 0.300){
                    sfondo.audio.volume+=0.01;
                }else{
                    sfondo.audio.volume=0.305;
                }
            }
            
            //console.log("-"+sfondo.audio.volume);
            if(bPausar.touch()){
                flujo(2);
            }
            
            for(i=1;i<=4;i++)jugadores[i].existir();
            
            driver.existir();
            
            if(jugadores[turno].tipo == "human"){
                //solo escuchar los botones cuando el jugador sea humano
                for(i=1;i<=280;i++){
                    if(botonesTablero[i].touch()){
                        touches[0]=null;

                        switch(turno){
                            case 1:
                                jugadores[1].estado=1;
                                jugadores[1].direccion=botonesTablero[i].direccion;
                            break;
                            case 2:
                                jugadores[2].estado=1;
                                jugadores[2].direccion=botonesTablero[i].direccion;
                            break;
                            case 3:
                                jugadores[3].estado=1;
                                jugadores[3].direccion=botonesTablero[i].direccion;
                            break;
                            case 4:
                                jugadores[4].estado=1;
                                jugadores[4].direccion=botonesTablero[i].direccion;
                            break;

                        }

                        for(i=1;i<=280;i++)botonesTablero[i].mode=false;
                    }//fin de SI si touch

                }//fon del for q recorre todos
            }//fin de NO es el sistema
            
            
            for(i=1;i<=maxSorpresas*4;i++)sorpresas[i].existir();
            for(i=1;i<=4;i++)frozens[i].existir();
            for(i=1;i<=4;i++)particulas[i].existir();
            for(i=1;i<=4;i++){if(chispas[i].mode)chispas[i].existir();}
            
            if(driver.boton.alpha < 0.900){
                driver.boton.alpha+=0.04;
            }else{
                driver.boton.alpha=1.0;
            }
            
            if(dataSaved.mode){
                dataSaved.vida-=1;
                dataSaved.alpha-=0.01;
                
                if(dataSaved.alpha < 0.10){
                    dataSaved.alpha=0.10;
                }
                if(dataSaved.vida < 1){
                    
                    dataSaved.mode=false;
                }
            }
       }//fin de jugando act
        
        if(terminado){
            if(bReiniciar2.touch()){
                localStorage.setItem("recuperar","0");
                verAds();
            }
            if(bMenu.touch())goTo("index.html");
        }//fin de terminado
       
        if(pausado){
            
            if(bContinuar.touch())flujo(1);
            //if(bReiniciar.touch())goTo("juego.html");
            if(bReiniciar.touch())goTo("juego.html");
            if(bMenu.touch())goTo("index.html");
            
            if(bGuardar.touch()){
                //falta el metodo de guardado del las posiciones de cada jugador y el turno
                guardaJuego();
                dataSaved.mode=true;
                dataSaved.alpha=1.0;
                dataSaved.vida=100;
                //flujo(1);
            }
            
            if(dataSaved.mode){
                dataSaved.vida-=1;
                dataSaved.alpha-=0.01;
                
                if(dataSaved.alpha < 0.10){
                    dataSaved.alpha=0.10;
                }
                if(dataSaved.vida < 1){
                    
                    dataSaved.mode=false;
                }
            }
            
            
            if(haySonido){
                if(sfondo.audio.volume > 0.005){
                    sfondo.audio.volume-=0.01;
                }else{
                    sfondo.audio.volume=0.0;
                }
                
            }
            
            //console.log("-"+sfondo.audio.volume);
        }//fin de pausado en act
    }//fin de act

    function paint(){
        //ctx.fillStyle='#000';
        ctx.clearRect(0,0,ancho,alto);
        
				ctx.fillStyle="rgb(131,255,82)";
        ctx.fillRect(0,0,ancho,alto);
        //amarillo
        ctx.beginPath();
        ctx.fillStyle="rgb(255,255,0)";
        ctx.fillRect(0,0,ancho/2,alto/2);
		ctx.fill();
		//azul
		ctx.fillStyle="rgb(0,0,255)";
        ctx.fillRect(ancho/2,0,ancho/2,alto/2);
		ctx.fill();
		//rojo
		ctx.fillStyle="rgb(255,0,0)";
        ctx.fillRect(0,alto/2,ancho/2,alto/2);
		ctx.fill();
		//verde
		ctx.fillStyle="rgb(30,123,30)";
        ctx.fillRect(ancho/2,alto/2,ancho/2,alto/2);
		ctx.fill();
		ctx.closePath();
        
        patron=ctx.createPattern(ipatron.pic,'repeat');
        
        ctx.strokeStyle="rgba(224,107,3,1)";
       
        ctx.fillStyle=patron;
        
        
        
        if(carpeta=="HD"){
            
            borde=3;
            ctx.fillRect(15,210,ancho-30,alto-420);
            ctx.fill();
            
            ctx.globalAlpha=0.03;
            ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
            ctx.globalAlpha=1.0;
            
            ctx.lineWidth=3;
            
            for(i=1;i<=14;i++){
                ctx.beginPath();
                ctx.moveTo((i*tamanoFicha)+15,210);
                ctx.lineTo((i*tamanoFicha)+15,alto-210);
                ctx.stroke();
                ctx.closePath();
                
                posicionesx[i]=((i*tamanoFicha)+15)-38;
            }
           
            for(i=1;i<=20;i++){
                ctx.beginPath();
                ctx.moveTo(15,(i*tamanoFicha)+210);
                ctx.lineTo(ancho-15,(i*tamanoFicha)+210);
                ctx.stroke();
                ctx.closePath();
                
                posicionesy[i]=((i*tamanoFicha)+210)-38;
            }
            ctx.strokeStyle="rgba(0,0,0,1)";
            ctx.lineWidth=7;
            ctx.beginPath();
            ctx.strokeRect(12,207,ancho-27,alto-416);
            ctx.stroke();
           
            ctx.closePath();
            
            
        }else if(carpeta=="SD"){
            
            borde=2;
            ctx.lineWidth=2;
            ctx.fillRect(10,140,ancho-20,alto-280);
            ctx.fill();
            
            ctx.globalAlpha=0.03;
            ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
            ctx.globalAlpha=1.0;
            
            for(i=1;i<=14;i++){
                ctx.beginPath();
                ctx.moveTo((i*tamanoFicha)+10,140);
                ctx.lineTo((i*tamanoFicha)+10,alto-140);
                ctx.stroke();
                ctx.closePath();
                
                posicionesx[i]=((i*tamanoFicha)+10)-25;
            }
           
            for(i=1;i<=20;i++){
                ctx.beginPath();
                ctx.moveTo(10,(i*tamanoFicha)+140);
                ctx.lineTo(ancho-10,(i*tamanoFicha)+140);
                ctx.stroke();
                ctx.closePath();
                
                 posicionesy[i]=((i*tamanoFicha)+140)-25;
            }
            
            ctx.lineWidth=5;
            ctx.beginPath();
            ctx.strokeRect(8,138,ancho-18,alto-278);
            ctx.stroke();
            ctx.closePath();
            
            
            
        }
				
        if(cargando){
            ctx.fillStyle="rgba(255,0,0,1)";
            ctx.font="20Px Arial";
            //ctx.fillText("cargando ...",500,500);
        }
        
        if(jugando){
            
						if(activos.amarillo){
            ctx.beginPath();
            ctx.fillStyle="rgba(255,255,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[1],posicionesy[1],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[1]-radioFicha,posicionesy[1]-radioFicha);
						}
        if(activos.azul){
            ctx.beginPath();
            ctx.fillStyle="rgba(0,0,255,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[14],posicionesy[1],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[14]-radioFicha,posicionesy[1]-radioFicha);
				}
        if(activos.rojo){
            ctx.beginPath();
            ctx.fillStyle="rgba(255,0,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[1],posicionesy[20],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[1]-radioFicha,posicionesy[20]-radioFicha);
						
        }
        if(activos.verde){
            ctx.beginPath();
            ctx.fillStyle="rgba(0,128,0,0.5)";
            ctx.beginPath();
            ctx.arc(posicionesx[14],posicionesy[20],radioFicha,0,Math.PI*2,true);
            ctx.fill();
            ctx.closePath();        
            ctx.drawImage(ifin.pic,posicionesx[14]-radioFicha,posicionesy[20]-radioFicha);
				}
				
            for(i=1;i<=280;i++)botonesTablero[i].pintar2();
            for(i=1;i<=4;i++)particulas[i].pintar();
            for(i=1;i<=4;i++)jugadores[i].pintar();
            for(i=1;i<=maxSorpresas*4;i++)sorpresas[i].pintar();
            for(i=1;i<=4;i++)frozens[i].pintar();
            for(i=1;i<=4;i++){if(chispas[i].mode)chispas[i].pintar();}
            
            driver.pintar();
            bPausar.pintar();
            /*
            ctx.fillStyle="rgba(0,0,0,1)";
            ctx.font="40Px Arial";
            ctx.fillText(turno,50,50);
            ctx.fillText("amarillo : "+jugadores[1].estado,50,100);
            ctx.fillText("azul     : "+jugadores[2].estado,50,150);
            ctx.fillText("rojo     : "+jugadores[3].estado,50,200);
            ctx.fillText("verde    : "+jugadores[4].estado,50,250);
            */
            if(dataSaved.mode){
                ctx.globalAlpha=dataSaved.alpha;
                ctx.drawImage(isaved.pic,isaved.x,isaved.y);
                ctx.globalAlpha=1.0;
            }
						if(err == ''){
							ctx.fillStyle="rgba(0,0,0,1)";
							ctx.font="12Px Arial";
							ctx.fillText(err,50,50);
						}
						
        }//finde jugando en el paiint
    
        if(pausado){
				ctx.fillStyle="rgba(0,0,0,0.3)";
				//ctx.font="20Px Arial";
				//ctx.fillText(frame,50,50);
				//ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
                ctx.fillRect(0,0,ancho,alto);
                ctx.fill();
                ctx.fillStyle="rgba(255,255,255,1)";
            
				bContinuar.pintar();
                bGuardar.pintar();
                bMenu.pintar();
                bReiniciar.pintar();
            
            if(dataSaved.mode){
                ctx.globalAlpha=dataSaved.alpha;
                ctx.drawImage(isaved.pic,isaved.x,isaved.y);
                ctx.globalAlpha=1.0;
            }
            
        }//finde pausado en el paiint
    
        if(terminado){
            ctx.fillStyle="rgba(0,0,0,0.3)";
            
            ctx.fillRect(0,0,ancho,alto);
            ctx.fill();
            
            ctx.lineWidth=aLinea;
            ctx.beginPath();
            ctx.strokeStyle="rgba(0,0,0,1)";
            ctx.fillStyle="rgba("+jugadores[finales[1]].color+",1)";
            ctx.fillRect(dPrimero.x,dPrimero.y,anchoBotones,altoBotones);
            ctx.strokeRect(dPrimero.x,dPrimero.y,anchoBotones,altoBotones);
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(imenu.pic,0,1*altoBotones,anchoBotones,altoBotones,dPrimero.x,dPrimero.y,anchoBotones,altoBotones);
            
            ctx.fillStyle="rgba("+jugadores[finales[2]].color+",1)";
            ctx.fillRect(dSegundo.x,dSegundo.y,anchoBotones,altoBotones);
            ctx.strokeRect(dSegundo.x,dSegundo.y,anchoBotones,altoBotones);
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(imenu.pic,0,2*altoBotones,anchoBotones,altoBotones,dSegundo.x,dSegundo.y,anchoBotones,altoBotones);
            
            if(finales[3] != null){
                ctx.fillStyle="rgba("+jugadores[finales[3]].color+",1)";
                ctx.fillRect(dTercero.x,dTercero.y,anchoBotones,altoBotones);
                ctx.strokeRect(dTercero.x,dTercero.y,anchoBotones,altoBotones);
                ctx.fill();
                ctx.stroke();
                ctx.drawImage(imenu.pic,0,3*altoBotones,anchoBotones,altoBotones,dTercero.x,dTercero.y,anchoBotones,altoBotones);
            }
            if(finales[4] != null){
                ctx.fillStyle="rgba("+jugadores[finales[4]].color+",1)";
                ctx.fillRect(dCuarto.x,dCuarto.y,anchoBotones,altoBotones);
                ctx.strokeRect(dCuarto.x,dCuarto.y,anchoBotones,altoBotones);
                ctx.fill();
                ctx.stroke();
                ctx.drawImage(imenu.pic,0,4*altoBotones,anchoBotones,altoBotones,dCuarto.x,dCuarto.y,anchoBotones,altoBotones);
            }
            
            ctx.closePath();
            bReiniciar2.pintar();
            bMenu.pintar();
        }
    }//fin de paint

    function enableInputs(){
        
			window.addEventListener("resize", function () {
				setTimeout(rPantalla,200);
			}, false);
		
        document.addEventListener('touchstart',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                x=~~((t[i].pageX-canvas2.offsetLeft)*scaleX);
                y=~~((t[i].pageY-canvas2.offsetTop)*scaleY);
                touches[0]=new Vtouch(x,y);
                
				
            }
        },false);
        document.addEventListener('touchmove',function(evt){
            evt.preventDefault();
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                if(touches[0]){
                    touches[0].x=~~((t[i].pageX-canvas2.offsetLeft)*scaleX);
                    touches[0].y=~~((t[i].pageY-canvas2.offsetTop)*scaleY);
                }
            }
        },false);
        document.addEventListener('touchend',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[0]=null;
                
                
                
            }
        },false);
        document.addEventListener('touchcancel',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[0]=null;
				
            }
        },false);
        
        document.addEventListener('mousedown',function(evt){
            evt.preventDefault();
            x=~~((evt.pageX-canvas2.offsetLeft)*scaleX);
            y=~~((evt.pageY-canvas2.offsetTop)*scaleY);
            touches[0]=new Vtouch(x,y);
            lastPress=1;
						//console.log(x,y);
        },false);
        document.addEventListener('mousemove',function(evt){
            if(touches[0]){
                touches[0].x=~~((evt.pageX-canvas2.offsetLeft)*scaleX);
                touches[0].y=~~((evt.pageY-canvas2.offsetTop)*scaleY);
            }
        },false);
        document.addEventListener('mouseup',function(evt){
            touches[0]=null;
			 
        },false);
		
		document.addEventListener('keyup',function(evt){
            evt.preventDefault();
			if(evt.keyCode==80){
				switch(jugando){
				case true:
				jugando=false;
				pausado=true;
				break;
				case false:
				jugando=true;
				pausado=false;
				break;
				}
			}
            
			
            
			
        },false);
        
        document.addEventListener('keydown',function(evt){
            //evt.preventDefault();
			
			//console.log(evt.keyCode);
			
        },false);
        
        
        
        var Vtouch=function (x,y){
            this.x=x||0;
            this.y=y||0;
        }
    }//fin de control
    
    //clase boton simple
    function boton(x,y,ancho,alto,cx,cy,img){
        
        this.x=~~(x);
        this.y=~~(y);
        this.width=ancho;
        this.height=alto;
        this.cortex=cx;
        this.cortey=cy;
        this.imagen=img;
        //console.log(this);
    }

    boton.prototype.touch=function(){
        
                if(touches[0]!=null){
                    if(this.x<touches[0].x&&
                        this.x+this.width>touches[0].x&&
                        this.y<touches[0].y&&
                        this.y+this.height>touches[0].y){
                        return true;
                    }
                }
            
            return false;
       
        
        
        
    }//fin del metodo touch

    boton.prototype.pintar=function(){
        
       
       ctx.drawImage(this.imagen,this.cortex*this.width,this.cortey*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
       // ctx.drawImage(ibotones.pic,0,0,512,88,40,500,512,88);
       // ctx.strokeStyle="rgba(20,255,255,1)";
        /*
        ctx.beginPath();
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.closePath();
        */
    }
    
    //botones redondos
    function botonRedondo(x,y,radio,color,mode,id,borde){
        this.id=id || 900;
        this.direccion=0;
        this.x=x;
        this.y=y;
        this.radio=radio;
        this.color=color;
        this.mode=mode;
        this.borde=borde || 1;
        this.alpha=0.5;
        //console.log(this.id+" "+this.x+" "+this.y+" "+this.mode);
    }
    
    botonRedondo.prototype.touch=function(){
        if(!this.mode)return;
        if(touches[0]!=null){//usar el  t de pitgrs para hallar distancia
            
                    dx=this.x-touches[0].x;
                    dy=this.y-touches[0].y;
                    
                    dt= ~~(Math.sqrt((dx*dx+dy*dy)-(this.radio)));
                    if(isNaN(dt))dt=0;
                  
                   if(dt < this.radio){
                       //console.log("me tocaron "+this.id);
                        return true;
                    }
                  return false;           
          }
    }
    
    botonRedondo.prototype.pintar=function(){
        //console.log("solo este");
        ctx.lineWidth=driver.borde;
        
        ctx.fillStyle="rgba("+this.color+","+this.alpha+")";
        ctx.strokeStyle="rgba(0,0,0,1)";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
        
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth=1;
        
        
        
        
    }
    
    botonRedondo.prototype.pintar2=function(){
        
        if(!this.mode)return;
        /*
        ctx.lineWidth=this.borde;
        ctx.strokeStyle="rgba("+this.color+",0.7)";
        
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
                
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth=1;
        */
        
        
        ctx.drawImage(ibotones.pic,this.direccion*tamanoFicha,0,tamanoFicha,tamanoFicha,this.x-radioFicha,this.y-radioFicha,tamanoFicha,tamanoFicha);
        /*
        ctx.fillStyle="rgba(0,0,0,1)";
            ctx.font="30Px Arial";
            ctx.fillText(this.id,this.x-20,this.y-5);
        */
    }//fin de pintar2

   window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,100);};
    })();
})();//find e todo el jego
