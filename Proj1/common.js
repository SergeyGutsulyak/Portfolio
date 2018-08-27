"use strict"
//console.log('Старт игры');

var game=new GameArea();
game.idName="game";
game.level=1;
var BASE_WIDTH=1280;
var BASE_HEIGHT=720;

//разметы окна
var widthMain;
var heightMain;

var mainContainer=document.getElementById("gameContainer");
//var mainContainer=document.getElementById("gameContainer");
//var objResized=[];//объекты размеры которых нужно изменять при перерисовке
//setSize();
function initGame(){
    var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    var stringName='GUTSULYAK_ENDPROJ_LEVEL1';
    
    $.ajax( {
        url : ajaxHandlerScript,
        type : 'POST', dataType:'json',
        data : { f : 'READ', n : stringName},
        cache : false,
        success : readReady,
        error : errorHandler
        }
    );
    
    function readReady(data){
        //console.log(data.result);
        var world=JSON.parse(data.result);
        //console.log(world);
        game.createMap(world);
        game.startGame();
        requestAnimationFrame(tick);
    }
    
    function errorHandler(jqXHR,statusStr,errorStr) {
        alert(statusStr+' '+errorStr);
    }
    
    
    var canvView=new ViewerCanv('CVS1',game);
    var conCanv=document.getElementById('CVS1');
    
    //conCanv.style.width="600px";
    //conCanv.style.height="600px";
    canvView.createGameArea();
    setSize();
    //console.log(document.body.clientWidth);
    function tick(){
        game.tick();
        canvView.createGameArea();
        requestAnimationFrame(tick);
    }
    

    //----------Управление жестами----------------------
    //var mc = new Hammer(mainContainer);
    var TMR=400;
    var mc    = new Hammer.Manager(mainContainer);
    var swipe     = new Hammer.Swipe();
    //console.log(swipe)
    mc.add(swipe);
    
    
    /*
    mc.on("doubletap", function(ev) {
        game.pauseGame;
        console.log("doubletap")
    });
    */
    
    var timerSwipeLeft=0;
    mc.on("swipeleft", function(ev) {
        game.rPlatform.startEngineRight();
        if (timerSwipeLeft){
            clearTimeout(timerSwipeLeft); // остановим
            timerSwipeLeft=0; // теперь таймера нет
        }
        timerSwipeLeft=setTimeout(function(){
            game.rPlatform.stopEngineRight();
        },TMR);   
    
    });
    
    var timerSwipeRight=0;
    mc.on("swiperight", function(ev) {
        game.rPlatform.startEngineLeft();
        if (timerSwipeRight){
            clearTimeout(timerSwipeRight); // остановим
            timerSwipeRight=0; // теперь таймера нет
        }
        timerSwipeRight=setTimeout(function(){
            game.rPlatform.stopEngineLeft();
            //console.log("стоп Левый");
        },TMR);   
    
    });
    
    var timerSwipeUp=0;
    mc.on("swipeup", function(ev) {
        game.rPlatform.startEngineMain();
        if (timerSwipeUp){
            clearTimeout(timerSwipeUp); // остановим
            timerSwipeUp=0; // теперь таймера нет
        }
        timerSwipeUp=setTimeout(function(){
            game.rPlatform.stopEngineMain();
        },TMR);   
    
    });
}


function keyDown(EO){
    EO=EO||window.event;
    game.controlHandleMove(EO.keyCode);
}
function keyUp(EO){
    EO=EO||window.event;
    game.controlHandleStop(EO.keyCode);
}
function keyUp2(EO){
    EO=EO||window.event;
    game.restartPress(EO.keyCode);
}

function clickStart(EO){
    EO=EO||window.event;
    game.startGame();
}


//-----------------------------------------------------


window.onresize=setSize;


function setSize(){
    var w =document.body.clientWidth
    ||window.innerWidth
    || document.documentElement.clientWidth;
    //var w=window.screen.availWidth;
    
    //console.log(window.innerWidth);
    //console.log(document.documentElement.clientWidth);
    //console.log(document.body.clientWidth);
    //console.log("width:"+document.body.clientWidth);
    var h=window.innerHeight
    ||document.body.clientHeight
    || document.documentElement.clientHeight;
    //var h=window.screen.availHeight;
    
    //console.log("height:"+h);

    var relWidth=w/BASE_WIDTH;
    var relHeight=h/BASE_HEIGHT;
    heightMain=0.95*h;
    widthMain=0.98*w;
    if (relWidth<relHeight){
        heightMain=Math.round(relWidth*BASE_HEIGHT);
    }
    else{
        widthMain=Math.round(relHeight*BASE_WIDTH);
    }
    //var docHtml=document.getElementById("screenHTML");
    var docHtml=document.getElementById("inScr");
    docHtml.style.width=widthMain+"px";
    docHtml.style.height=heightMain+"px";

    var conCanv=document.getElementById("CVS1");
    if (conCanv){
        //console.log(conCanv);
        conCanv.style.width=widthMain+"px";
        conCanv.style.height=heightMain+"px";
    }

    var endBlock=document.getElementById("inEndGame");
    if (endBlock){
        //console.log(conCanv);
        endBlock.style.width=widthMain+"px";
    }

}

window.onhashchange=SwitchToStateFromURLHash;

function UpdateToState(NewStateH){
    var PageHtml='';
    
    switch(NewStateH.pagename){
        case 'Main':
        PageHtml='<div id="screenHTML">'+
            '<h1>Правила игры</h1>'+
            '<P>Вы управляете летающие тарелкой и собираете ящики.'+
            '   Для перехода на следующий уровень необходимо вернуться на стартовую платформу.'+
            '   У тарелки есть три двигетеля, при работе которых тарелка движется с ускорением.'+
            '   Если главный двигетель отключен, на тарелку действует сила притяжения и она начинает падать.'+
            '</P>'+
            '<h2>Управление</h2>'+
            '<p>'+
            '    Стрелки вверх, влево, вправо. При игре на мобильной платформе свайп вверх, влево, вправо.'+
            '</p>'+
            '<div id="links">'+
            '    <a href="#Game_1" id="next">Начать</a>'+
            '</div>'+
            '</div>';
            mainContainer.innerHTML=PageHtml;
            
            break;
        case 'Game':
            PageHtml='<canvas id="CVS1" ></canvas>'+
            '<div id="screenHTML">'+
            '<div id="inScr">'+
            '<div id="endGame">'+
            '<div id="inEndGame">'+
            '    <p id="bigText">Вы проиграли</p>'+
            '    <div id="links">'+
            '        <a href="#" id="next">Следующая</a>'+
          //'        <a href="#" id="prev">Предыдущая</a>'+
            '       <a href="#Main" id="main">На главную</a>'+
            '   </div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
            mainContainer.innerHTML=PageHtml;
            var screenHtml=document.getElementById("screenHTML");
            
            initGame();
            //console.log(relHeight+"px");
            screenHtml.style.display="none";
            //screenHtml.style.top="-"+heightMain+"px";
            break;
    }
    //return PageHtml;
    
    

}

function dspEnd(){
    var screenHtml=document.getElementById("screenHTML");
    screenHtml.style.display="";
    screenHtml.style.opacity="0";
    var inEndBlock=document.getElementById("inEndGame");
    inEndBlock.style.width=widthMain+"px";

    var endBlock=document.getElementById("endGame");
    endBlock.style.top="-"+heightMain+"px";

    setTimeout(function(){screenHtml.style.opacity="0.8";
                endBlock.style.top="0px"},0);
    

}
game.displayEndGame=dspEnd;
// вызывается при изменении закладки УРЛа
  // а также при первом открытии страницы
  // читает нужное состояние приложения из закладки УРЛа
  // и устанавливает+отображает его
  function SwitchToStateFromURLHash()
  {
    //console.log("Изменение хэша");
    var URLHash=window.location.hash;

    // убираем из закладки УРЛа решётку
    // (по-хорошему надо ещё убирать восклицательный знак, если есть)
    var StateStr=URLHash.substr(1);

    if ( StateStr!="" ) // если закладка непустая, читаем из неё состояние и отображаем
    {
      var PartsA=StateStr.split("_")

      var NewStateH={ pagename: PartsA[0] }; // первая часть закладки - номер страницы
      if ( NewStateH.pagename=='Game' )
        NewStateH.gameLevel=PartsA[1]; // для игры нужна ещё вторая часть уровень

      UpdateToState(NewStateH);
    }
    else
      UpdateToState( { pagename:'Main' } ); // иначе показываем главную страницу
  }

  // устанавливает в закладке УРЛа новое состояние приложения
  // и затем устанавливает+отображает это состояние
  function SwitchToState(NewStateH)
  {
    // устанавливаем закладку УРЛа
    // нужно для правильной работы кнопок навигации браузера
    // (т.к. записывается новый элемент истории просмотренных страниц)
    // и для возможности передачи УРЛа другим лицам
    var StateStr=NewStateH.pagename;
    if ( NewStateH.pagename=='Game' )
      StateStr+="_"+NewStateH.gameLevel;
    document.location.hash=StateStr;

    // АВТОМАТИЧЕСКИ вызовется SwitchToStateFromURLHash()
    // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
  }

  function SwitchToMainPage()
  {
    SwitchToState( { pagename:'Main' } );
  }

  function SwitchToGamePage()
  {
    SwitchToState( { pagename:'Game', gameLevel: '1'} );
  }
  // переключаемся в состояние, которое сейчас прописано в закладке УРЛ
  SwitchToStateFromURLHash();