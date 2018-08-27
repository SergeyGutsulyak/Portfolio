import { LOAD_GROUPS,CHANGE_CURRENT_GROUP} from './groupsAC';

//const START_USER_ON_PAGE=20;//количество отображаемых пользователй на странице

const initState={
    all:[],      //все группы
  //filtr:[],
  //  crop:{},     //видимые пользователи
    mode:{dataReady:false},
    currentGroup:0,
}

function groupsReducer(state=initState,action) {
  //console.log("Редьюсер");
  //console.log('Тип действия:'+action.type);
  switch (action.type) {
    case LOAD_GROUPS:{
    
    console.log('Загрузка данных групп');
    console.log(action.groups);
    
    let ArrayFromAjax=[];
    for (let i in action.groups.data){
      ArrayFromAjax.push(action.groups.data[i]);
    }

   
    let newState={...state,
        all:[...ArrayFromAjax],//все пользователи
        filtr:[...ArrayFromAjax],//отфильтрованные пользователи
        //crop:ArrayFromAjax.slice(0,START_USER_ON_PAGE),//отображаемые пользователи
        mode:{dataReady:true,
        }
    };
      return newState;
    };
    

    case CHANGE_CURRENT_GROUP:{
      console.log('Изменяем номер текущей группы'+action.idCurrentGroup)
      let newState={...state,currentGroup:action.idCurrentGroup}
      //console.log(newState)
      return newState;
    }

    default:
      return state;
  }
}

export default groupsReducer;