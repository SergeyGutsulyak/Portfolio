const LOAD_USERS='LOAD_USERS';
const CHANGE_USERS_PAGE='CHANGE_USERS_PAGE';
const CHANGE_DATA_READY='CHANGE_DATA_READY';
const INVERS_TYPE_VIEW='INVERS_TYPE_VIEW';
const CHANGE_COUNT_USER_ON_PAGE='CHANGE_COUNT_USER_ON_PAGE';
const SET_FILTR_ALL='SET_FILTR_ALL';
const SET_FILTR_ADD='SET_FILTR_ADD';
const SET_FILTR_DEL='SET_FILTR_DEL';

const users_load=function(loadedUsers) {
  return {
    type: LOAD_USERS,
    users:loadedUsers,
  };
}

const change_users_page=function(numberPage) {
  return {
    type: CHANGE_USERS_PAGE,
    page:numberPage,
  };
}

const change_users_dataready=function(isReady) {
  return {
    type: CHANGE_DATA_READY,
    isReady:isReady,
  };
}

const user_invers_type_view=function(keyUser){
  return {
    type:INVERS_TYPE_VIEW,
    keyUser:keyUser,
  }
}

const change_count_users_on_page=function(countUserOnPage){
  return {
    type:CHANGE_COUNT_USER_ON_PAGE,
    countUserOnPage:countUserOnPage,
  }
}
const set_filtr_all=function(){
  return {
    type:SET_FILTR_ALL,
  }
}

const set_filtr_add=function(){
  return {
    type:SET_FILTR_ADD,
  }
}

const set_filtr_del=function(){
  return {
    type:SET_FILTR_DEL,
  }
}

export {
  users_load, LOAD_USERS,
  change_users_page, CHANGE_USERS_PAGE,
  change_users_dataready,CHANGE_DATA_READY,
  user_invers_type_view,INVERS_TYPE_VIEW,
  change_count_users_on_page,CHANGE_COUNT_USER_ON_PAGE,
  set_filtr_all,SET_FILTR_ALL,
  set_filtr_add,SET_FILTR_ADD,
  set_filtr_del,SET_FILTR_DEL,

}

