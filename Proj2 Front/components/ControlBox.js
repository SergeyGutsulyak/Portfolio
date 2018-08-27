import React from 'react';
import {connect} from 'react-redux';
import ReqAJAX from '../my_modules/ReqAJAX';
import {MAIN_HOST} from '../my_modules/Settings';
import './ControlBox.css';

import { NavLink } from 'react-router-dom';

import FormAddGroup from './FormAddGroup';

class GroupsList extends React.PureComponent {

    fetchError = (errorMessage) => {
        console.error(errorMessage);
    };
      
    fetchSuccess = (loadedData) => {
       //console.log(loadedData);
       this.props.dispatch(groups_load(loadedData));
    };
    getAjaxData=new ReqAJAX(MAIN_HOST+"groups",this.fetchError,this.fetchSuccess);  

    componentWillMount(){
        //console.log('Событие componentWillMount');
       // this.getAjaxData.loadData();
    }

render() {
    //console.log(this.props.history)
    return(
        <div className='GroupsList'>
            <FormAddGroup/>
        </div>
    );
  }

}

const mapStateToProps = function (state) {
     return {
      groups: state.groups,
    };
  };
  
export default connect(mapStateToProps)(GroupsList);