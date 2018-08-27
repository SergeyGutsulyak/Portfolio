import { LOAD_USERS, CHANGE_USERS_PAGE,
        CHANGE_DATA_READY,INVERS_TYPE_VIEW,
        CHANGE_COUNT_USER_ON_PAGE,SET_FILTR_ALL,
        SET_FILTR_ADD, SET_FILTR_DEL, } from './usersAC';

const START_USER_ON_PAGE=20;//количество отображаемых пользователй на странице

const initState={
    all:[],      //все пользователи
    filtr:[],
    mode:{dataReady:false,
          UsersOnPage:START_USER_ON_PAGE,
        },
}

function usersReducer(state=initState,action) {
  //console.log("Редьюсер");
  //console.log('Тип действия:'+action.type);
  switch (action.type) {
    case LOAD_USERS:{
    
    let ArrayFromAjax=[];
    for (let i in action.users.data){
      let user=action.users.data[i];
      user['isFullView']=false;
      user['key']=i;
      ArrayFromAjax.push(action.users.data[i]);
    }
    //сортировка массива по дате 
    ArrayFromAjax.sort((a,b)=>{return b.action.date-a.action.date;})

    let newState={
        all:[...ArrayFromAjax],//все пользователи
        filtr:[...ArrayFromAjax],//отфильтрованные пользователи
        mode:{dataReady:true,
              usersOnPage:START_USER_ON_PAGE,
            }
    };
      return newState;
    };

    case CHANGE_USERS_PAGE:{
      //console.log(CHANGE_USERS_PAGE);
      //console.log('Номер страницы: '+action.page);
      let newState={...state};
        //console.log(newState);
      return newState;
    }

    case CHANGE_DATA_READY:{
      let newState={...state,
          mode:{...state.mode,dataReady:action.isReady}
      };
      return newState;
    }

    case INVERS_TYPE_VIEW:{
      var posUser=0;
      //console.log(action.keyUser)
      //поиск пользователя с заданным ключем
      for (let i in state.filtr){
        let user=state.filtr[i];
        //console.log('user')
        if (user.key==action.keyUser){
          //console.log('пользователь найден')
          posUser=i;
          break;
        }
      }
      let newFiltrArray=[...state.filtr];
      let newUserLink={...newFiltrArray[posUser]}
      newUserLink.isFullView=(newFiltrArray[posUser].isFullView)?(false):(true);
      newFiltrArray[posUser]=newUserLink;
      let newState={...state,filtr:newFiltrArray}
      return newState;

    }

    case CHANGE_COUNT_USER_ON_PAGE:{
      let newState={...state,mode:{...state.mode,usersOnPage:action.countUserOnPage}};
      console.log('изменение числа пользователей на странице');
      return newState;
    }

    case SET_FILTR_ALL:{
      let newState={...state,filtr:[...state.all]}
      return newState;
    }

    case SET_FILTR_DEL:{
      let newState={...state,filtr:state.all.filter((curValue)=>{return curValue.action.type=='del'})}
      return newState;
    }
    case SET_FILTR_ADD:{
      let newState={...state,filtr:state.all.filter((curValue)=>{return curValue.action.type=='add'})}
      return newState;
    }
    default:
      return state;
  }
}

export default usersReducer;