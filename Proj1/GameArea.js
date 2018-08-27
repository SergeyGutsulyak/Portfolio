//теннисное поле
function GameArea(){
    this.level=1;
    this.height=720;//высота поля
    this.width=1280; //ширина поля
    this.arrBarrier=[];//массив объектов препятствий
    this.arrPoints=[];//массив объектов для перемещения или посещения

    //this.arrRefresh=[];//объекты которые нужно перерисовать
    
    this.rPlatform=new Platform();
    this.rPlatform.idName="platform";
    //this.arrRefresh.push(this.rPlatform);
    this.mission={};//миссия начальная точка, конечная, точки откуда забирать

    this.finishOn=0;//флаг доступа финишной точки

    this.endPoint={};//Точка финиша
    this.endingGame=false;//флаг конец игры

    //Режимы игры
    this.gameAction=true;//режим игры
    this.gamePause=false;//Пауза

    this.displayEndGame=null;//функция конец игры
}

GameArea.prototype.createMap=function(world){
    
    /*
    var world={barriers:{
                  barrier1:
                  {x:0,y:600,width:200,height:40,type:'start'},
                  barrier2:
                  {x:0,y:300,width:200,height:40,type:'barrier'},
                  barrier3:
                  {x:400,y:100,width:400,height:40,type:'barrier'},
                  barrier4:
                  {x:1000,y:200,width:200,height:40,type:'barrier'},
                  barrier5:
                  {x:1000,y:680,width:200,height:40,type:'barrier'},
                  barrier6:
                  {x:400,y:450,width:400,height:40,type:'barrier'}
                  },
              mission:{
                platform:
                {x:0,y:560,width:150,height:40},
                
                points:{point1:{
                    params:{x:50,y:200,width:100,height:100,type:'box'}
                },
                point2: {
                    params:{x:1050,y:100,width:100,height:100,type:'box'} 
                },
                point3: {
                    params:{x:1050,y:580,width:100,height:100,type:'box'} 
                }
                ,},
                platformEnd:{x:50,y:560,width:100,height:40}
              }    
             }
            */
   // console.log(JSON.stringify(world));


    this.mission=world['mission'];
    this.rPlatform.reset(world['mission']['platform']);

    for  (var keyH in world['barriers']){
        var newBarrier=new Barrier();
        newBarrier.setParam(world['barriers'][keyH]);
        newBarrier.idName=keyH;
        this.arrBarrier.push(newBarrier);
    }
    for  (var keyH in world['mission']['points']){
        var newPoint=new PointObject();
        newPoint.setParam(world['mission']['points'][keyH]['params']);
        newPoint.idName=keyH;
        newPoint.culcArea(this.rPlatform);
        this.arrPoints.push(newPoint);
    }

    this.endPoint=new PointObject();
    this.endPoint.setParam(world['mission']['platformEnd']);
    this.endPoint.idName='endPoint';
    this.endPoint.culcArea(this.rPlatform);
 
}
//обработка тика
GameArea.prototype.tick=function(){
    if (this.gameAction){
      this.rPlatform.mov();
        
        for (var i in this.arrBarrier){
            if (this.arrBarrier[i].collisonTest(this.rPlatform)){
                  //console.log("Столкновение")
                if (this.rPlatform.testCrach(this.arrBarrier[i])){
                  //  console.log("Авария");
                  this.rPlatform.crashPlatform(this);
                }
            }
        }
        //если платформа пуста точки контрольные обрабатываются
        for (var i in this.arrPoints){
            if (this.arrPoints[i].collisonTest(this.rPlatform)){
                //console.log("Столкновение")
                if (this.rPlatform.testPoint(this.arrPoints[i])){
                    //this.arrPoints[i].deleteObjDOM();//удаление из DOM
                    this.arrPoints.splice(i,1);//удаление из массива
                    if (this.arrPoints.length==0){
                        this.createFinishPoint();
                    }
                }
            }
        }
        if (this.finishOn){
            if (this.rPlatform.testPoint(this.endPoint)){
                console.log("Конец миссии");
            }
        }
    
        if (this.outBound(this.rPlatform)){
           // console.log("Авария");
           this.rPlatform.crashPlatform(this);
        }
        //this.rPlatform.refreshPos();
    }


}
/*
//создание объектов в DOM
GameArea.prototype.initDisplay=function(){
    //console.log('Поле создается')
    var pole=document.createElement("div");
    pole.style.width=this.width+"px";
    pole.style.height=this.height+"px";
    pole.style.position="relative";
    pole.id=this.idName;
    for (var i in this.arrBarrier){
        var objDOM=this.arrBarrier[i].displayObj();
        objDOM.className="barrier";
        pole.appendChild(objDOM);
    }
    //console.log(this.arrPoints)
    for (var i in this.arrPoints){
        var objDOM=this.arrPoints[i].displayObj();
        objDOM.className="point";
        pole.appendChild(objDOM);
    }
    pole.appendChild(this.rPlatform.displayObj());
   //console.log(pole)
    return pole;
}*/

GameArea.prototype.createFinishPoint=function(){
    this.finishOn=1;//разрешение работы финишной точки
    //document.getElementById(this.idName).appendChild(this.endPoint.displayObj());
    //this.endPoint.refreshPos();//отображение
}


GameArea.prototype.restartGame=function(){

}

GameArea.prototype.endGame=function(){
    //this.gameAction=false;//не обрабатывать перемещения
    if (!this.endingGame){
        this.endingGame=true;
        this.rPlatform.fuelCurrent=0;
        this.rPlatform.speedX=0;
        this.displayEndGame();
    }
}
/*
GameArea.prototype.displayEndGame=function(){
    var mainContainer=document.getElementById("gameContainer");
   /*
    var divLinks=document.createElement("div");
    var newLink=document.createElement("a");
    newLink.innerHTML="Начать заново";
    newLink.setAttribute("href","#");
    divLinks.appendChild(newLink);
    divLinks.style.width=this.width+"px";
    divLinks.id="divLinks";

    var divText=document.createElement("div");
    divText.innerHTML="Конец игры"
    divText.id="divEndGame";
    divText.style.width=this.width+"px";
   
    var divEndGame=document.createElement("div");
    
    divEndGame.appendChild(divText);
   // divEndGame.appendChild(divLinks);

    divEndGame.id="gameover";
   // divEndGame.style.width=this.width+"px";
   // divEndGame.style.height=this.height+"px";
    mainContainer.appendChild(divEndGame);
    
    setTimeout(function(){divEndGame.style.opacity="0.8";
                    divText.style.top=this.height/2-80+"px"},0);

}
*/
GameArea.prototype.pauseGame=function(){
    this.gameAction=this.gameAction?false:true;
    console.log(this.gameAction);
}
//обработка событй клавиш
GameArea.prototype.controlHandleMove=function(keyCode){
    switch (keyCode){
        case 38: this.rPlatform.startEngineMain();
                break;
        case 39: this.rPlatform.startEngineLeft();
                break;
        case 37: this.rPlatform.startEngineRight();
                break;
        case 32: this.pauseGame();
    }
}
//обработка отпускания клавиши
GameArea.prototype.controlHandleStop=function(keyCode){
    switch (keyCode){
        case 38: this.rPlatform.stopEngineMain();
                break;
        case 39: this.rPlatform.stopEngineLeft();
                break;
        case 37: this.rPlatform.stopEngineRight();;
                break;
    }
}

//проверка выхода за границы мяча
GameArea.prototype.outBound=function(obj){
    var flagCrash=false; 
    if (obj.y<0){
        obj.y=0;
        if (Math.abs(obj.speedY)>=obj.speeCrashY){
            flagCrash=true;
        }
        obj.speedY=0;
    }
    
    if (obj.y+obj.height>this.height){
        obj.y=this.height-obj.height;
        if (Math.abs(obj.speedY)>=obj.speeCrashY){
            flagCrash=true;
        }
        obj.speedY=0;
    }

    if (obj.x<0){
        obj.x=0;//в начало координат
        if (Math.abs(obj.speedX)>=obj.speeCrashX){
            flagCrash=true;
        }
        obj.speedX=0;
    }

    if (obj.x+obj.width>this.width){
        obj.x=this.width-obj.width;
        if (Math.abs(obj.speedX)>=obj.speeCrashX){
            flagCrash=true;
        }
        obj.speedX=0;
    }
    return flagCrash;
}

GameArea.prototype.startGame=function(){
    window.addEventListener('keydown',keyDown,false);
    window.addEventListener('keyup',keyUp,false);
}
