
import React from 'react';

import {connect} from 'react-redux';
import UsersList from '../components/UsersList';
import {users_load,change_users_dataready,change_users_page} from '../redux/usersAC';
import {groups_change_current} from '../redux/groupsAC';
import ReqAJAX from '../my_modules/ReqAJAX';
import {MAIN_HOST} from '../my_modules/Settings';


class Page_Users extends React.PureComponent {
  
  fetchError = (errorMessage) => {
    console.error(errorMessage);
  };

  fetchSuccess = (loadedData) => {
    console.log('Закгрузка данные в Page_Users')
    console.log(loadedData);
    this.props.dispatch(users_load(loadedData));
    this.props.dispatch(groups_change_current(this.props.match.params.idGroup));    
  };
  
  getAjaxData=new ReqAJAX(MAIN_HOST+"users",this.fetchError,this.fetchSuccess); 



  componentWillMount(){
    //console.log('Событие componentWillMount  Page_Users');
    //console.log(this.props.match)
    if (this.props.match.params.idGroup==0){
      this.props.dispatch(groups_change_current(0));
      return
    }
    this.props.dispatch(change_users_dataready(false));
    this.getAjaxData.setBody({'idGroup':this.props.match.params.idGroup});
    this.getAjaxData.loadData();
    
    
 }
 componentWillReceiveProps(newProps){
  //console.log('Событие componentWillReceiveProps Page_Users');
  //this.getAjaxData.setBody({'idGroup':this.props.match.params.idGroup})
  //this.getAjaxData.loadData();
  this.props.dispatch(change_users_page(1));
  
}
  render() {
    console.log('render PageUsers')
    
    //page={this.props.match.params.page}
    return (
          <UsersList/>
    );
  }
}

const mapStateToProps = function (state) {
  // этому компоненту ничего не нужно из хранилища Redux
  return { }; 
};


export default connect(mapStateToProps)(Page_Users);
