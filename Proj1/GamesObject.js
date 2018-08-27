function MovingObj(width,height,x,y){
    var self=this;
    self.width=0;
    self.height=0;
    self.x=0;//координата по x
    self.y=0;//координата по y
    self.speedX=0;
    self.speedY=0;
    self.idName="renameId";
   // self.typeObj=null;

    
    this.startX=0;
    this.startY=0;
    //self.container=container;//ссылка на объект в котором находится
}
MovingObj.prototype.setSize=function(width,height){
    this.width=width;
    this.height=height;
}

MovingObj.prototype.setSpeed=function(speedX,speedY){
    this.speedX=speedX;
    this.speedY=speedY;
}

MovingObj.prototype.mov=function(){
    this.x+=this.speedX;
    this.y+=this.speedY;
}

MovingObj.prototype.inversSpeed=function(){
    this.speedX=-this.speedX;
}

//определяет есть ли столкновение с переданным объектом, возврат True если есть
MovingObj.prototype.collisonTest=function(obj2){
    var xColl=false;
    var yColl=false;
  
    if ((this.x + this.width > obj2.x) && (this.x < obj2.x + obj2.width)) xColl = true;
    if ((this.y + this.height > obj2.y) && (this.y < obj2.y + obj2.height)) yColl = true;
  
    if (xColl&yColl){return true;}
    return false;
}

MovingObj.prototype.displayObj=function(){
    //console.log(this)
    var objDOM=document.createElement("div");
    objDOM.style.width=this.width+"px";
    objDOM.style.height=this.height+"px";
    objDOM.style.position="absolute";
    objDOM.style.left=this.x+"px";
    objDOM.style.top=this.y+"px";
    objDOM.id=this.idName;
    objDOM.className="MovingObj";
    return objDOM;
}
MovingObj.prototype.displayObjCanv=function(){

}
//обновеление позиции
MovingObj.prototype.refreshPos=function(){
    var objDOM=document.getElementById(this.idName);
    objDOM.style.left=this.x+"px";
    objDOM.style.top=this.y+"px";
}

//в функцию передаются хэш x: y: width: hight:
MovingObj.prototype.setParam=function(params){
    this.x=params['x'];
    this.y=params['y'];
    this.width=params['width'];
    this.height=params['height'];
    this.typeObj=params['type'];
    this.startX=this.x;
    this.startY=this.y;
}

//-------------------------------------------------
//класс для движующийся платформы
function Platform(){
    MovingObj.call(this);
    this.accelerationX=0;//ускорение по X
    this.accelerationY=0;//ускорение по Y
    
    this.speedXPrev=0;
    this.speedYPrev=0;

    this.engainPowerX=0.1;//ускорение по X при работе двигателя
    this.engainPowerY=0.4;//ускорение по Y при работе двигателя

    this.speeCrashX=4;//скорость по X при которой платформа терпит аварию
    this.speeCrashY=5;//скорость по Y при которой платформа терпит аварию

    this.liveMax=3;//количество жизней
    this.lives=this.liveMax;
    this.fuelMax=200;//объем топливного бака
    this.fuelCurrent=this.fuelMax;//текущее количество топлива

    this.leftEngineStatus=0;//состояний двигателя 0-стоп, 1-работа
    this.rightEngineStatus=0;
    this.mainEngineStatus=0;

    this.crashed=false;//если платформа сбита
    this.timeStartCrash=null;//время начала крушения
    this.timeCrash=2000;//время крушения в мс

    this.G=0.1;//сила притяжения 
}

Platform.prototype=Object.create(MovingObj.prototype);
Platform.prototype.constructor=Platform;

Platform.prototype.restartPlatform=function(){
    this.accelerationX=0;//ускорение по X
    this.accelerationY=0;//ускорение по Y
    this.speedX=0;
    this.speedY=0;
    this.speedXPrev=0;
    this.speedYPrev=0;
    this.x=this.startX;
    this.y=this.startY;
    this.fuelCurrent=this.fuelMax;
    this.leftEngineStatus=0;//состояний двигателя 0-стоп, 1-работа
    this.rightEngineStatus=0;
    this.mainEngineStatus=0;
    this.crashed=false;
}
//перемещение по тику
Platform.prototype.mov=function(){
    this.accelerationX=this.engainPowerX*(-this.rightEngineStatus+this.leftEngineStatus);
    this.accelerationY=this.G-this.engainPowerY*this.mainEngineStatus;

    //console.log(this.accelerationX);
    this.x+=this.speedX;
    this.y+=this.speedY;
    //сохранение скорости с которой было перемещение
    //для расчта направления удара
    this.speedXPrev=this.speedX;
    this.speedYPrev=this.speedY;

    if (this.fuelCurrent<=0){
        this.crashed=true;
    }
    else{
        this.fuelCurrent-=(this.engainPowerX*(this.leftEngineStatus+this.rightEngineStatus)+this.engainPowerY*this.mainEngineStatus);
        //console.log(this.fuelCurrent)
    }
    this.speedX+=this.accelerationX;//новая скорость
    this.speedY+=this.accelerationY;//новая скорость
}

Platform.prototype.reset=function(params){
    this.setParam(params);
    this.speedX=0;
    this.speedY=0;
    this.accelerationX=0;
    this.accelerationY=0;
}
//функция при столкновении
Platform.prototype.crashPlatform=function(objGame){
    console.log(this.lives)
    self=this;
    if (!this.crashed){
        this.lives--;
        this.crashed=true;
        this.accelerationX=0;
        this.accelerationY=0;
        var tm=new Date()
        this.timeStartCrash =tm.getTime();
        setTimeout(rst,this.timeCrash);
   
        if (this.lives==0){
            objGame.endGame();
        }
    }
    function rst(){
        if (self.lives>0){
        self.restartPlatform()
       }
    }
}


//Функция после обнаржения столкновения
//в каком направлении движется, в таком и столкновение, где меньше смещение там и столкновение
Platform.prototype.testCrach=function(obj){
    //объект при толкновении движется вправо
    var flagCrash=false;    
    if(this.speedX>0){
        var dx=this.x+this.width-obj.x;
        if (dx<=this.speedXPrev*2){
            this.x=obj.x-this.width;
            if (Math.abs(this.speedX)>=this.speeCrashX){
                flagCrash=true;
            }
            this.speedX=0;
        }
    }

    //объект при cтолкновении движется влево    
    if(this.speedX<0){
        var dx=obj.x+obj.width-this.x;
        if (dx<=Math.abs(this.speedXPrev*2)){
            this.x=obj.x+obj.width;
            if (Math.abs(this.speedX)>=this.speeCrashX){
                flagCrash=true;
            }
            this.speedX=0;

        }
    }

    //объект при cтолкновении движется вниз    
    if(this.speedY>0){
        var dy=this.y+this.height-obj.y;
        if (dy<=this.speedYPrev*2){
            this.y=obj.y-this.height;
            if (Math.abs(this.speedY)>=this.speeCrashY){
                flagCrash=true;
            }
            this.speedY=0;

        }        
    }

    //объект при cтолкновении движется вверх    
    if(this.speedY<0){
        var dy=(obj.y+obj.height)-this.y;
        if (dy<=Math.abs(this.speedYPrev*2)){
            this.y=obj.y+obj.height;
            if (Math.abs(this.speedY)>=this.speeCrashY){
                flagCrash=true;
            }
            this.speedY=0;
        }    
    }

    return flagCrash;
}

Platform.prototype.startEngineMain=function(){
    //console.log("работает главный двигатель")
    if (!this.crashed){
        //this.accelerationY=aY-this.engainPowerY;
        this.mainEngineStatus=1;}
}

Platform.prototype.startEngineLeft=function(){
    //console.log("работает левый двигатель")
    if (!this.crashed){
    this.accelerationX=this.engainPowerX;
    this.leftEngineStatus=1;}
}

Platform.prototype.startEngineRight=function(){
    //console.log("работает правый двигатель")
    if (!this.crashed){
    //this.accelerationX=-this.engainPowerX;
    this.rightEngineStatus=1;};
}

Platform.prototype.stopEngineMain=function(){
    //this.accelerationY=aY;
    this.mainEngineStatus=0;

}

Platform.prototype.stopEngineLeft=function(){
    //this.accelerationX=aX;
    this.leftEngineStatus=0;
}

Platform.prototype.stopEngineRight=function(){
    //this.accelerationX=aX;
    this.rightEngineStatus=0;
    
}


//функция определяет пересечение контрольной точки
//контролькная точка должна быть полностью внутри платформы,
Platform.prototype.testPoint=function(obj){
    if (!this.crashed){
    if ((this.x<=obj.areaX)&&(this.x+this.width>=obj.areaX+obj.areaWidth)&&
        (this.y<=obj.areaY)&&(this.y+this.height>=obj.areaY+obj.areaHeight)){
            return true;
        }
    else return false;
    }
    else return false;
}
//-----------------------------------------
//класс для прегдрад

function Barrier(){
    MovingObj.call(this);
}

Barrier.prototype=Object.create(MovingObj.prototype);
Barrier.prototype.constructor=Platform;

Barrier.prototype.mov=function(){
    this.x+=this.speedX;
    this.y+=this.speedY;
}


//объект, который необходимо пересечь или забрать для выполнения миссии
function PointObject(){
    MovingObj.call(this);
    //Область которую должен полностью пересечь тележка, чтобы забрать
    this.areaWidth=this.width;
    this.areaHeight=this.height;
    this.areaX=this.x;
    this.areaY=this.y;

    this.areaProcX=0.7; //соотношение области и размера тележки
    this.areaProcY=0.7;
    
    this.moving=0;//0-на месте, 1-перемещается
}

PointObject.prototype=Object.create(MovingObj.prototype);
PointObject.prototype.constructor=PointObject;

//рассчитывается контрольная точка, которую должна пересечь тележка
//расчет исходя из размеров тележки
PointObject.prototype.culcArea=function(telObj){
    if (telObj.width*this.areaProcX>this.width) this.areaWidth=telObj.width*this.areaProcX;
    if (telObj.height*this.areaProcY>this.heigth) this.areaHeight=telObj.height*this.areaProcY;
    this.areaX=this.x+(this.width-this.areaWidth)/2;
    this.areaY=this.y+this.height;
}
//функция удаления объекта из DOM
PointObject.prototype.deleteObjDOM=function(){
    var currObj=document.getElementById(this.idName);
    currObj.parentElement.removeChild(currObj);
}

PointObject.prototype.endMission=function(){
}