function ViewerCanv(idCanv,game){
    var self=this;
    this.canvas1=null;
    this.context1=null;
    this.canvas1=document.getElementById(idCanv);
        

    this.game=game;

    //this.canvas1.setAttribute('width',this.game.width+"px");
    //this.canvas1.setAttribute('heigth',this.game.height+"px");
    this.canvas1.width=this.game.width;
    this.canvas1.height=this.game.height;
    this.context1=this.canvas1.getContext('2d');

    this.dataReady=false;//гоотовность картинок

    var srcFon='images/fon.jpg';//фон
    var srcTel='images/platform.png';
    var srcStart='images/start.png';
    var srcBox='images/box.jpg';
    this.imagesForGame=[srcFon,srcTel,srcStart,srcBox];
    this.loadImages();

    this.fon=new Image();
    this.fon.src=srcFon;

    this.tel=new Image();
    this.tel.src=srcTel;

    this.startImage=new Image();
    this.startImage.src=srcStart;

    this.boxImage1=new Image();
    this.boxImage1.src=srcBox;
/*
   function createFon(){
       console.log(self.game.width);
       self.context1.drawImage(self.fon,0,0,self.game.width,self.game.height);
       self.context1.restore();
   }*/

}

//загрузка изображений, после кждой загрузки событие, уменьшающие счетчик, 
//когда все загружены создается поле и устанавливается флаг готовности
ViewerCanv.prototype.loadImages=function(){
    self=this;
    var cntReadyImg=this.imagesForGame.length;//счетчик не загруженных изображений
    for(var i in this.imagesForGame){
        var newImage=new Image();
        newImage.src=this.imagesForGame[i];
        newImage.onload=loadFn;
    }

    function loadFn(){
        cntReadyImg--;
        if (cntReadyImg==0){
            this.dataReady=true;
            self.createGameArea();
        }
    }

}

ViewerCanv.prototype.createGameArea=function(){
    this.context1.drawImage(this.fon,0,0,this.game.width,this.game.height);
    
    for (var i in this.game.arrBarrier){
        //console.log(this.game.arrBarrier[i]);
        var curBarrier=this.game.arrBarrier[i];
        if (curBarrier.typeObj=='start'){
            this.context1.drawImage(this.startImage,curBarrier.x,curBarrier.y,curBarrier.width,curBarrier.height);
        }
        else{ this.context1.fillStyle='#FF00FF';
        this.context1.fillRect(curBarrier.x,curBarrier.y,curBarrier.width,curBarrier.height);}
       
    }
    //console.log(this.arrPoints)
    for (var i in this.game.arrPoints){
        var curPoint=this.game.arrPoints[i];
        this.context1.drawImage(this.boxImage1,curPoint.x,curPoint.y,curPoint.width,curPoint.height);
    }

    var alpha=1;//поврежденный карабль падает и исчезает
    if (game.rPlatform.crashed){
        var curTime=new Date();
        alpha=1-(curTime.getTime()-game.rPlatform.timeStartCrash)/(game.rPlatform.timeCrash+100);
    }
    this.context1.save();
    this.context1.globalAlpha=alpha;
    var telj=this.game.rPlatform;
    this.context1.drawImage(this.tel,telj.x,telj.y,telj.width,telj.height);
    this.context1.restore();

    //this.context1.restore();
}

