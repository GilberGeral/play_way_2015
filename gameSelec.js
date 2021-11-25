/*
esta plantilla tiene dos resoluciones compatibles
y trabaja al 100% d e la pantalla
1920x1080
1280x720

trabaja con sonidos mp3 y ogg
tiene soporte para teclado y eventos touch

esta diseñada en modo landscape

*/

'use strict';
(function(){
    
    if(window.cordoba){
        document.addEventListener("deviceready",init, false);
    }else{
        window.addEventListener('load',init,false);
    }
    var canvas=null,ctx=null,canvas2=null,ctx2=null;
    var scaleX=1,scaleY=1;
    var touches=[];
    var lastPress=-1;
    var version=1;//version de juego. 1 full, 0 gratis
    
    
    var ancho=0,alto=0;//marca esta relacionada con los eventos touch
    var totalObjetos=6,time=0;
    var objetosCargados=0;
	var nMax=0,nMin=0,aleat=0;
    var frame=0,anchoBotones=0,altoBotones=0,pixelRatio=0;
   
    //booleanas
    var cargando=true,jugando=false,mensaje=false,haySonido=true,pausado=false;
	var PI=3.14159;
	
  
    var carpeta="";
    var sonidosSrc="ogg";
    var sextension="",typeAudio="";
	
    var patron,gradiente1;
	
   //jsons
    var dataAma={cortey:2,tipo:"none",ancho:0,alto:0,x:0,y:0}
    var dataAzu={cortey:2,tipo:"none",ancho:0,alto:0,x:0,y:0}
    var dataRoj={cortey:2,tipo:"none",ancho:0,alto:0,x:0,y:0}
    var dataVer={cortey:2,tipo:"none",ancho:0,alto:0,x:0,y:0}
    
    var dataMensaje={mode:false,vida:100,alpa:1.0}
    
    //imagenes
    
    //declaracion de botones
    var bAtras,bPlay,bAzul,bRojo,bAmarillo,bVerde,bPrueba;
    
    //declaracion de sonidos
    var sfondo,sBoton;
    
    //clase imagen
    function imagen(data){
        
        this.obtenerData=data;
        this.x=0;
        this.y=0;
        this.pic=new Image();
        //console.log("data "+this.obtenerData);
    }
   
    
    
    var ititulo=new imagen(true);
    
    var iselec=new imagen(true);
    var iselecUI=new imagen(true);
    var imensaje=new imagen(true);
   
    //dev
	var mousex=0;
	var mousey=0,x=0,y=0;
    var dx=0,dy=0;//mundo en metros, por ahora
    
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
					canvas.style.width = gameWidth + "px";
					canvas.style.height = gameHeight + "px";
				
					canvas.style.left = ((gameWidth - (ancho * optimalRatio))/2)+"px";
					canvas.style.top = ((gameHeight - (alto * optimalRatio))/2)+"px";
				
					//console.log("a");
			}else {
					//console.log("b");
					canvas.style.left = ((gameWidth - (ancho * optimalRatio))/2)+"px";
					canvas.style.top = ((gameHeight - (alto * optimalRatio))/2)+"px";
					canvas.style.width = ancho * optimalRatio + "px";
					canvas.style.height = alto * optimalRatio + "px";
			}
			
			scaleX = ancho/(gameWidth-(gameWidth-(ancho*optimalRatio)));
			scaleY = alto/(gameHeight-(gameHeight - (alto*optimalRatio)));
			
			
			//console.log("scale x "+scaleX+" scaley "+scaleY);
			
				//console.log("an "+ancho+" al "+alto);
			//dataRatio.sw = parseInt(canvas.offsetLeft);
			//dataRatio.sh = parseInt(canvas.offsetTop);
			
			
			//scaleX = (ancho / (dataRatio.sw+dataRatio.offx) );
			//scaleY = (alto / (dataRatio.sh+(dataRatio.offy*1.15)) );
		 
			
			//console.log(scaleX+" ancho usado " + dataRatio.sw);
			//console.log(scaleY+" alto usado " + dataRatio.sh);
			//u_gen.w = window.innerWidth;
			//u_gen.h = window.innerHeight;
			if(!jugando)enableInputs();
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
    
    function sonido(id,src,mute,loop,autoplay,preload,vol){
        
        this.id=id;
        this.audio=new Audio(src);
        this.audio.mute=mute;
        if(vol==null){this.audio.volume=1.0}else{this.audio.volume=vol;}
        this.audio.loop=loop;
        this.audio.autoplay=autoplay;
        this.audio.preload=preload;
        this.audio.type=typeAudio;
        this.ultimoVol=1.0;
        this.agonizando=false;
        this.audio.addEventListener('canplaytrhough',this.cargar(),false);
    }

    
     sonido.prototype.cargar=function(){objetosCargados++;} 
    
     sonido.prototype.agonizar=function(){
         //matar lentamente este sonido
         if(this.agonizando | !haySonido)return;
         
         if(this.agonizando){
             if(this.audio.volume > 0){
                 this.audio.volume-=0.01;
             }
         }
     }
    
     
    function cambiarTipo(cual){
        
        
        if(haySonido)sBoton.audio.play();
        
        switch(cual.tipo){
                case "none":
                    cual.tipo="human";
                    cual.cortey=0;
                break;
                case "human":
                    cual.tipo="system";
                    cual.cortey=1;
                break;
                case "system":
                    cual.tipo="none";
                    cual.cortey=2;
                break;
        }
    }
    
    function creaSonidos(){
            sfondo=new sonido(21,sextension+"/fondo."+sextension,false,false,false,true,1.0);
            sBoton=new sonido(22,sextension+"/boton."+sextension,false,false,false,true,1.0);
     }
    
    
    function iniciaSonidos(){
        if(localStorage.getItem("sonido")==null){
           
        }else if(localStorage.getItem("sonido")=="0"){
            haySonido=false;
             //bSonido.cortex=1;
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.250;
            sfondo.audio.play();
            sfondo.audio.muted=true;
        }else if(localStorage.getItem("sonido")=="1"){
            //inicie el sonido de fondo
            haySonido=true;
            //bSonido.cortex=0;
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.250;
            sfondo.audio.play();
        }
        //console.log(sfondo.audio.volume);
    }//fin de inicia sonidos
    
    function creaBotones(){
        
       //bJugar=new boton((ancho/2)-(anchoBotones/2),((alto/10)*5),anchoBotones,(ibotones.pic.height)/5,0,0);
        
        bAmarillo=new boton(ancho-anchoBotones,~~((alto/100)*32.5),anchoBotones,altoBotones,0,0);
        bRojo=new boton(ancho-anchoBotones,~~((alto/100)*47.5),anchoBotones,altoBotones,0,0);
        bAzul=new boton(ancho-anchoBotones,~~((alto/100)*62.5),anchoBotones,altoBotones,0,0);
        bVerde=new boton(ancho-anchoBotones,~~((alto/100)*77.5),anchoBotones,altoBotones,0,0);
        
        bPlay=new boton(ancho-anchoBotones,~~((alto/100)*92.5),anchoBotones,altoBotones,0,2);
        bAtras=new boton(0,~~((alto/100)*92.5),anchoBotones,altoBotones,0,1);
        
       
    }//fin de creabotones
   
    
    function random(min, max){
		nMax = max;
		nMin = min;
		aleat=Math.floor(Math.random()*(nMax-(nMin-1))) + nMin;
        return aleat;
		}
    
    
    function fondo(){ 
        
        
    }
    
    function goTo(donde){
        
		if(navigator.isCocoonJS){
		
		      Cocoon.App.load(donde);
            
		}else{
			window.location=donde;
			
		}
        
    }
    
    function goGame(donde){
        localStorage.setItem("amarillo",String(dataAma.tipo));

        localStorage.setItem("azul",String(dataAzu.tipo));
        localStorage.setItem("rojo",String(dataRoj.tipo));
        localStorage.setItem("verde",String(dataVer.tipo));

        goTo(donde);
    }
    
    
    function toJuego(donde){
        //guarde en localStorage la configuracion de jugadores
        var sumadorS=0;
        var sumadorH=0;
        
        if(dataAma.tipo=="human")sumadorH++;
        if(dataAzu.tipo=="human")sumadorH++;
        if(dataRoj.tipo=="human")sumadorH++;
        if(dataVer.tipo=="human")sumadorH++;
        
        if(dataAma.tipo=="system")sumadorS++;
        if(dataAzu.tipo=="system")sumadorS++;
        if(dataRoj.tipo=="system")sumadorS++;
        if(dataVer.tipo=="system")sumadorS++;
        
        if(sumadorH > 1){
            goGame(donde);
            return;
        }
        if(sumadorH >0 & sumadorS > 0){
            goGame(donde);
            return;
        }
        dataMensaje.mode=true;
    }
    
    function init(){
    
            
        pixelRatio=window.devicePixelRatio || 1;
        
       if((window.innerHeight*pixelRatio) > 1281){
            carpeta="HD";
            ancho=1080;
            alto=1920;
        }else{
            carpeta="SD";
            ancho=720;
            alto=1280;
        }
        
        
        console.log("modo : "+carpeta);
        scaleX=(ancho/screen.availWidth);
				scaleY=(alto/(screen.availHeight-64));
        
        canvas=document.getElementById('canvas');
		ctx=canvas.getContext('2d',{antialias:false});
		canvas.width=ancho;
        canvas.height=alto;
	if(navigator.platform=="Win32"){canvas.style.position='fixed';}else{canvas.style.position='static';}
		canvas.style.position='absolute';
		canvas.style.backgroundColor='transparent';
		canvas.style.top='0';
        canvas.style.left='0';
        canvas.style.width= (screen.availWidth-0)+'px';
        canvas.style.height= (screen.availHeight-64)+'px';
		canvas.style.zIndex="10";
		
        if(canPlayOgg()){
            sextension="ogg";
            typeAudio="audio/ogg";
        }else{
            sextension="mp3";
            typeAudio="audio/mpeg";
        }
       
        ititulo.pic.onload=function(){
            objetosCargados++;
            if(ititulo.obtenerData){
                ititulo.x=(ancho/2)-(this.width/2);
                ititulo.y=(alto/10)-(this.height/2);
            }
        }
        ititulo.pic.src=carpeta+"/logoGrande.png";
        
         imensaje.pic.onload=function(){
            objetosCargados++;
            if(imensaje.obtenerData){
                imensaje.x=(ancho/2)-(this.width/2);
                imensaje.y=(alto/2)-(this.height/2);
            }
        }
        imensaje.pic.src=carpeta+"/mensaje.png";
        
        
        
        iselecUI.pic.onload=function(){
            objetosCargados++;
            
            
            if(iselecUI.obtenerData){
                anchoBotones=this.width;
                altoBotones=~~(this.height/3);
            }
        }
        iselecUI.pic.src=carpeta+"/selec3.png";
        
        
        iselec.pic.onload=function(){
            objetosCargados++;
                        
            if(iselec.obtenerData){
                
                dataAma.x=0;
                dataAma.y=(alto/100)*32.5;
                dataAma.ancho=(this.width);
                dataAma.alto=~~(this.height/3);
                //console.log(dataAma);
                
                dataRoj.x=0;
                dataRoj.y=(alto/100)*47.5;
                dataRoj.ancho=(this.width);
                dataRoj.alto=~~(this.height/3);
                //console.log(dataAma);
                
                dataAzu.x=0;
                dataAzu.y=(alto/100)*62;
                dataAzu.ancho=(this.width);
                dataAzu.alto=~~(this.height/3);
                //console.log(dataAma);
                
                dataVer.x=0;
                dataVer.y=(alto/100)*77.5;
                dataVer.ancho=(this.width);
                dataVer.alto=~~(this.height/3);
                //console.log(dataAma);
                
            }
        }
        iselec.pic.src=carpeta+"/selec2.png";
        
        
        
        creaSonidos();
				rPantalla();
        enableInputs();
       
        run();
    }//fin de init()

    function run(){
        requestAnimationFrame(run);
       
        
        act();
        paint();
    }

    function act(){
       
        if(cargando){
            if(objetosCargados >= totalObjetos){
                cargando=false;
                jugando=true;
                creaBotones();
                iniciaSonidos();
                fondo();
            }else{
                //todavia cargando
            }
        }//fin de cargando
        
        if(jugando){//jugando de act
            frame++;
            
            
          if(!dataMensaje.mode){
              
        
            if(bPlay.touch()){
                toJuego("juego.html");
                touches[0]=null;
            }
            if(bAtras.touch()){
                goTo("index.html");
                touches[0]=null;
            }
            
            if(bAmarillo.touch()){
                touches[0]=null;
               cambiarTipo(dataAma);
                
            }
            if(bAzul.touch()){
                touches[0]=null;
               cambiarTipo(dataAzu);
                
            }
            if(bRojo.touch()){
                touches[0]=null;
               cambiarTipo(dataRoj);
                
            }
            if(bVerde.touch()){
                touches[0]=null;
               cambiarTipo(dataVer);
                
            }
            
            
        }else{
               // console.log(dataMensaje.alpa);
                dataMensaje.vida-=1;
                
                if(dataMensaje.vida < 0){
                    dataMensaje.mode=false;
                    dataMensaje.vida=100;
                   
                }
            }
       }//fin de jugando act
        
        
    }//fin de act

    function paint(){
        //ctx.fillStyle='#000';
        ctx.clearRect(0,0,ancho,alto);
				
				ctx.fillStyle="rgb(131,255,82)";
        ctx.fillRect(0,0,ancho,alto);
        
        gradiente1=ctx.createLinearGradient(0,0,0,alto);
        gradiente1.addColorStop(0,"#e3a000");
        gradiente1.addColorStop(1,"#c46100");
        ctx.fillStyle=gradiente1;
        ctx.fillRect(0,0,ancho,alto);
        ctx.drawImage(ititulo.pic,ititulo.x,ititulo.y);
        
        //filas de elegibles
        ctx.beginPath
        ctx.fillStyle="rgba(255,255,0,1)";
        ctx.fillRect(0,(alto/100)*30,ancho,~~(iselecUI.pic.height/1.5));
        
        ctx.fillStyle="rgba(0,0,255,1)";
        ctx.fillRect(0,(alto/100)*45,ancho,~~(iselecUI.pic.height/1.5));
        
        ctx.fillStyle="rgba(255,0,0,1)";
        ctx.fillRect(0,(alto/100)*60,ancho,~~(iselecUI.pic.height/1.5));
        
        ctx.fillStyle="rgba(0,128,0,1)";
        ctx.fillRect(0,(alto/100)*75,ancho,~~(iselecUI.pic.height/1.5));
        
       
        
        ctx.fill();
        ctx.closePath();
				
        if(cargando){
            
        }
        if(jugando){
            ctx.fillStyle="rgba(255,0,0,1)";
            /*
            ctx.font="40Px Arial";
            ctx.fillText(frame,ancho-100,50);
            */
            ctx.drawImage(iselec.pic,0,dataAma.cortey*dataAma.alto,dataAma.ancho,dataAma.alto,dataAma.x,dataAma.y,dataAma.ancho,dataAma.alto);
            
            ctx.drawImage(iselec.pic,0,dataAzu.cortey*dataAzu.alto,dataAzu.ancho,dataAzu.alto,dataAzu.x,dataAzu.y,dataAzu.ancho,dataAzu.alto);
            
            ctx.drawImage(iselec.pic,0,dataRoj.cortey*dataRoj.alto,dataRoj.ancho,dataRoj.alto,dataRoj.x,dataRoj.y,dataRoj.ancho,dataRoj.alto);
            
            ctx.drawImage(iselec.pic,0,dataVer.cortey*dataVer.alto,dataVer.ancho,dataVer.alto,dataVer.x,dataVer.y,dataVer.ancho,dataVer.alto);
           
            
                if(!dataMensaje.mode){
                    bAmarillo.pintar();
                    
                    bAzul.pintar();
                    bRojo.pintar();
                    bVerde.pintar();
                    
                    bAtras.pintar();
                    bPlay.pintar();
                    
                    
                }else{
                    ctx.fillStyle="rgba(0,0,0,"+0.5+")";
                    ctx.fillRect(0,0,ancho,alto);
                    ctx.fill();
                    
                    ctx.drawImage(imensaje.pic,imensaje.x,imensaje.y);
                    
                }
            }//finde jugando en el paiint
        
    }//fin de paint

    function enableInputs(){
			
        window.addEventListener("resize", function () {
				setTimeout(rPantalla,200);
			}, false);
			
			
        document.addEventListener('touchstart',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                x=~~((t[i].pageX-canvas.offsetLeft)*scaleX);
                y=~~((t[i].pageY-canvas.offsetTop)*scaleY);
                touches[0]=new Vtouch(x,y);
                
				
            }
        },false);
        document.addEventListener('touchmove',function(evt){
            evt.preventDefault();
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                if(touches[0]){
                    touches[0].x=~~((t[i].pageX-canvas.offsetLeft)*scaleX);
                    touches[0].y=~~((t[i].pageY-canvas.offsetTop)*scaleY);
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
            x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
            y=~~((evt.pageY-canvas.offsetTop)*scaleY);
            touches[0]=new Vtouch(x,y);
            lastPress=1;
			
        },false);
        document.addEventListener('mousemove',function(evt){
            if(touches[0]){
                touches[0].x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
                touches[0].y=~~((evt.pageY-canvas.offsetTop)*scaleY);
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
    function boton(x,y,ancho,alto,cx,cy){
        this.x=x;
        this.y=y;
        this.width=ancho;
        this.height=alto;
        this.cortex=cx;
        this.cortey=cy;
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
        
        ctx.drawImage(iselecUI.pic,this.cortex*this.width,this.cortey*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
        
    }

   window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,100);};
    })();
})();//find e todo el jego
