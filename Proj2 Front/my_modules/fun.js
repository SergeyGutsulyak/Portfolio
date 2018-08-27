const platforms={ 1:'мобильная версия',
2:'приложение для iPhone',
3:'приложение для iPad',
4:'приложение для Android',
5:'приложение для Windows Phone',
6:'приложение для Windows 10',
7:'полная версия сайта',
8:'VK Mobile'}
/* Дата последнего посещения в базе не актуальна, по причине редкого обновления*/
function formatDateTime(dt){
    let year=dt.getFullYear();
    let month=dt.getMonth()+1;
    let day=dt.getDate();
    let hours=dt.getHours();
    let minutes=dt.getMinutes();
    let seconds=dt.getSeconds();

    return str0l(day,2) + '.' + str0l(month,2) + '.' + year + ' ' + str0l(hours,2) + ':' + str0l(minutes,2) + ':' + str0l(seconds,2);

  
}

function formatDate(dt){
    let year=dt.getFullYear();
    let month=dt.getMonth()+1;
    let day=dt.getDate();
    return str0l(day,2) + '.' + str0l(month,2) + '.' + year ;
 
}

  // дополняет строку Val слева нулями до длины Len
function str0l(val,len) {
    let strVal=val.toString();
    while ( strVal.length < len )
    strVal='0'+strVal;
    return strVal;
}
function msToDateTime(ms){
    let dt=new Date(ms*1000);
    return formatDateTime(dt);
}

//функция отбрасывает часы минуты секунды

function delHourMinSec(ms){
    let dt=new Date(ms*1000);
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    //console.log(dt)
    return dt;
}

export {msToDateTime,platforms,delHourMinSec,formatDate}