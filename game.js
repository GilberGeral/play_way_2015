/*
esta plantilla tiene dos resoluciones compatibles
y trabaja al 100% d e la pantalla
1920x1080
1280x720

trabaja con sonidos mp3 y ogg
tiene soporte para teclado y eventos touch

esta diseñada en modo landscape

*/
window["GD_OPTIONS"] = {
	"gameId": "043fde736c864fe88372261fc2732bc9",
	"onEvent": function(event) {
		switch (event.name) {
			case "SDK_GAME_START":
					// advertisement done, resume game logic and unmute audio
					console.log("start");
					bloquear(false);
					
					break;
			case "SDK_GAME_PAUSE":
					// pause game logic / mute audio
					console.log("pause");
					bloquear(true);
					break;
			case "SDK_GDPR_TRACKING":
					// this event is triggered when your user doesn't want to be tracked
					console.log(89);
					
			break;
			case "SDK_GDPR_TARGETING":
					// this event is triggered when your user doesn't want personalised targeting of ads and such
				console.log(90);
				
			break;
		}
	},
};

function verAds(){
	if (typeof gdsdk !== 'undefined' && gdsdk.showBanner !== 'undefined') {
		gdsdk.showBanner();
	}
}

function bloquear(r){
			console.log("desbloqueo "+r);
			if(r){
				sfondo.audio.volume=0.0;
				bloqued2=true;
				bloqued=true;
			}else{
				sfondo.audio.volume=0.4;
				bloqued2=false;
				bloqued=false;
			
			}
			
		}
		

    //document.addEventListener("deviceready",init, false);
    
    if(window.cordoba){
        document.addEventListener("deviceready",init, false);
        console.log("se fue por cordoba");
    }else{
        window.addEventListener('load',init,false);
        console.log("se fue por normal");
    }
    
    var canvas=null,ctx=null,canvas2=null,ctx2=null;
    var scaleX=1,scaleY=1;
    var touches=[];
    var lastPress=null;
    var version=1;//version de juego. 1 full, 0 gratis
    
    
    var ancho=0,alto=0;//marca esta relacionada con los eventos touch
    var totalObjetos=3,time=0;
    var objetosCargados=0;
	var nMax=0,nMin=0,aleat=0;
    var frame=0,anchoBotones=0,pixelRatio=0;
   
    //booleanas
    var cargando=true,jugando=false,perdido=false,haySonido=true,mostrarC=false;
	var PI=3.14159;
	
  
    var carpeta="";
    var sonidosSrc="ogg";
    var sextension="",typeAudio="";
	
    var patron,gradiente1;
	
   //jsons
    
   
    //imagenes
    
    //declaracion de botones
    var bJugar,bContinuar,bSonido,bFacebook,bFull;
    
    //declaracion de sonidos
    var sfondo;
    
    //clase imagen
    function imagen(data){
        
        this.obtenerData=data;
        this.x=0;
        this.y=0;
        this.pic=new Image();
        //console.log("data "+this.obtenerData);
    }
   
    
    var playerDog={};
    var ititulo=new imagen(true);
    var ibotones=new imagen(false);
    //dev
	var mousex=0;
	var mousey=0,x=0,y=0;
    var dx=0,dy=0;//mundo en metros, por ahora
    
    //variables de ads
    var bannerStatus="";
    var interstitialStatus="";

    var banner;
    var interstitial;
    var demoPosition;

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
        this.audio.muted=mute;
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
    
         
    function creaSonidos(){
         sfondo=new sonido(21,sextension+"/fondo."+sextension,false,false,false,true,1.0);
        
     }
    
    function iniciaSonidos(){
        if(localStorage.getItem("sonido")==null){
            localStorage.setItem("sonido","1");
            haySonido=true;
             bSonido.cortex=0;
        }else if(localStorage.getItem("sonido")=="0"){
            haySonido=false;
             bSonido.cortex=1;
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.250;
            sfondo.audio.play();
            sfondo.audio.muted=true;
        }else if(localStorage.getItem("sonido")=="1"){
            //inicie el sonido de fondo
            haySonido=true;
            bSonido.cortex=0;
            sfondo.audio.loop=true;
            sfondo.audio.volume=0.250;
            sfondo.audio.play();
        }
    }
    
    function creaBotones(){
        
        bJugar=new boton((ancho/2)-(anchoBotones/2),((alto/10)*5),anchoBotones,(ibotones.pic.height)/5,0,0);
        bContinuar=new boton((ancho/2)-(anchoBotones/2),((alto/10)*4),anchoBotones,(ibotones.pic.height)/5,0,1);
        bFull=new boton((ancho/2)-(anchoBotones/2),((alto/10)*6),anchoBotones,(ibotones.pic.height)/5,0,2);
        bSonido=new boton((ancho/2)-(anchoBotones/2),((alto/10)*7),(ibotones.pic.height)/5,(ibotones.pic.height)/5,0,3);//el cx debera cambier en swith sonido
        bFacebook=new boton(((ancho/2)+(anchoBotones/2))-((ibotones.pic.height)/5),((alto/10)*7),(ibotones.pic.height)/5,(ibotones.pic.height)/5,0,4);
       
        if(localStorage.getItem("recuperar") == null){
            localStorage.setItem("recuperar","0");
            localStorage.setItem("continuar","0");
            //ojo cambiar en continuar
            //cuando lo abra en gameNext, volver el valor a cero
            mostrarC=false;
        }else if(localStorage.getItem("recuperar") == "0"){
            mostrarC=false;
        }else if(localStorage.getItem("recuperar") == "1"){
            mostrarC=true;
        }
        
        
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
				sfondo.audio.volume=0.3;
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
        
    function fondo(){
        
        
    }
    
		
		
    function goTo(donde){
        
		
		
		if(navigator.isCocoonJS){
            
		Cocoon.App.load(donde);
            
		}else{
			window.location=donde;
			
		}
        
    }
    
    function meGusta(){
        //abre un link a facebook
        //de me gusta
        Cocoon.App.openURL("https://www.facebook.com/DiyoGames?fref=ts");
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
        
        
        console.log("modo "+carpeta+", pixel ratio "+pixelRatio);
        scaleX=(ancho/screen.availWidth);
				scaleY=(alto/(screen.availHeight));
        
        canvas=document.getElementById('canvas');
		ctx=canvas.getContext('2d',{antialias:false});
		canvas.width=ancho;
        canvas.height=alto;
	if(navigator.platform=="Win32"){canvas.style.position='fixed';}else{canvas.style.position='static';}
		//canvas.style.position='absolute';
		canvas.style.backgroundColor='transparent';
		canvas.style.top='0';
        canvas.style.left='0';
        canvas.style.width='100%';
        canvas.style.height='100%';
		canvas.style.zIndex="10";
		
	//capa de escenrio de fondo
	
        
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
        
        ibotones.pic.onload=function(){
            objetosCargados++;
            anchoBotones=this.width;
            
            if(ibotones.obtenerData){
                ibotones.x=(ancho/2)-(this.width/2);
                ibotones.y=(alto/10)-(this.height/2);
            }
        }
        ibotones.pic.src=carpeta+"/UIBotones.png";
        
         rPantalla();
        creaSonidos();
        enableInputs();
        
        run();
        
    }//fin de init()

    function run(){
        requestAnimationFrame(run);
        
        var now=Date.now();
        var deltaTime=now-time;
        if(deltaTime>1000)deltaTime=0;
        time=now;
        
        act();
        paint();
    }

    function act(){
       
        if(cargando){
            if(objetosCargados==totalObjetos){
                cargando=false;
                jugando=true;
                creaBotones();
                iniciaSonidos();
                fondo();
								verAds();
            }else{
                //todavia cargando
								
            }
        }//fin de cargando
        
        if(jugando){//jugando de act
            
            frame++;
          if(bSonido.touch()){
              touches[0]=null;
              switchAudio();
          }
        if(bJugar.touch()){
              touches[0]=null;
              goTo("selec.html");
            
          }
					/*
        if(bFacebook.touch()){
            touches[0]=null;
            meGusta();
        }*/
            
        if(mostrarC){
            if(bContinuar.touch()){
                touches[0]=null;
                localStorage.setItem("continuar","1");
                goTo("juego.html");
            }
        }
        if(version==0){
            if(bFull.touch()){
                touches[0]=null;
                //link a play store de la version full
                
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
				
        if(cargando){
            
        }
        if(jugando){
            ctx.fillStyle="rgba(255,0,0,1)";
            /*
            ctx.font="20Px Arial";
            ctx.fillText(frame,50,50);
            */
            bJugar.pintar();
            if(mostrarC)bContinuar.pintar();
            bSonido.pintar();
            //bFacebook.pintar();
             if(version==0)bFull.pintar();
            }//finde jugando en el paiint
        
    }//fin de paint

  function enableInputs(){
		window.addEventListener("resize", function () {
			setTimeout(rPantalla,200);
		}, false);
	
        document.addEventListener('touchstart',function(evt){
            var t=evt.changedTouches;
            
                x=~~((t[0].pageX-canvas.offsetLeft)*scaleX);
                y=~~((t[0].pageY-canvas.offsetTop)*scaleY);
                touches[0]=new Vtouch(x,y);
               
				
            
        },false);
        document.addEventListener('touchmove',function(evt){
            evt.preventDefault();
            var t=evt.changedTouches;
           
                 if(touches[0] != null){
                    touches[0].x=~~((t[0].pageX-canvas.offsetLeft)*scaleX);
                    touches[0].y=~~((t[0].pageY-canvas.offsetTop)*scaleY);
                 }
            
        },false);
        document.addEventListener('touchend',function(evt){
           
           
                touches[0]=null;
                
                
                
            
        },false);
        document.addEventListener('touchcancel',function(evt){
            
            
                touches[0]=null;
				 
            
        },false);
        
        document.addEventListener('mousedown',function(evt){
            evt.preventDefault();
            x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
            y=~~((evt.pageY-canvas.offsetTop)*scaleY);
            touches[0]=new Vtouch(x,y);
            lastPress=1;
						console.log(x,y);
						
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
            
			if(evt.keyCode==83){bajando=false;subiendo=false;}
            if(evt.keyCode==87){bajando=false;subiendo=false;}
            
			
        },false);
        
        document.addEventListener('keydown',function(evt){
            //evt.preventDefault();
			if(evt.keyCode==83){bajando=true;subiendo=false;}
            if(evt.keyCode==87){bajando=false;subiendo=true;}
			//console.log(evt.keyCode);
			
        },false);
        
        
        
        var Vtouch=function (x,y){
            this.x=x||0;
            this.y=y||0;
        }
    }//fin de control
    
    //clase boton simple
    function boton(x,y,width,height,cx,cy){
        this.x=(x==null)?0:x;
        this.y=(y==null)?0:y;
        this.width=(width==null)?0:width;
        this.height=(height==null)?this.width:height;
        this.cortex=cx;
        this.cortey=cy;
        //console.log("se creo el boton "+this.radio);
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
        
       
       ctx.drawImage(ibotones.pic,this.cortex*this.width,this.cortey*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
       // ctx.drawImage(ibotones.pic,0,0,512,88,40,500,512,88);
        ctx.strokeStyle="rgba(20,255,255,1)";
        /*
        ctx.beginPath();
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.closePath();
        */
    }

   window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,100);};
    })();

