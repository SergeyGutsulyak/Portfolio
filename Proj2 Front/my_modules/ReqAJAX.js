import {default as isoFetch} from 'isomorphic-fetch';
/*Запросы AJAX */
class  ReqAJAX{

    constructor(_url,funFetchError,funFetchSuccess){
        this.url=_url;
        this.fetchError=funFetchError;
        this.fetchSuccess=funFetchSuccess
    }
    url="";
    param={
        method: 'post',
        headers: {
            "Accept": "application/json",
        },
    }

    setURL=(_url)=>{
        this.url=_url;
    };

    setBody=(_paramBody)=>{
        //console.log(_paramBody)
        this.param['body']= JSON.stringify(_paramBody);
        //console.log(this.param)
    };
    setFetchError=(funFetchError)=>{
        this.fetchError=funFetchError;
    };
    setFetchSuccess=(funFetchSuccess)=>{
        this.fetchSuccess=funFetchSuccess;
    };

    loadData = () => {
        
        isoFetch(this.url, this.param )
            .then( (response) => { // response - HTTP-ответ
                if (!response.ok) {
                    let Err=new Error("fetch error " + response.status);
                    Err.userMessage="Ошибка связи";
                    throw Err; // дальше по цепочке пойдёт отвергнутый промис
                }
                else
                    return response.json(); // дальше по цепочке пойдёт промис с пришедшими по сети данными
            })
            .then( (data) => {
                try {
                    this.fetchSuccess(data); // передаём полезные данные в fetchSuccess, дальше по цепочке пойдёт успешный пустой промис
                }
                catch ( error ){
                    this.fetchError(error.message); // если что-то пошло не так - дальше по цепочке пойдёт отвергнутый промис
                }
            })
            .catch( (error) => {
                this.fetchError(error.userMessage||error.message);
            })
        ;
    };
    }

export default ReqAJAX;