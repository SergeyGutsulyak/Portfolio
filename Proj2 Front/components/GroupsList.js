import React from 'react';
import {connect} from 'react-redux';
import {groups_load} from '../redux/groupsAC';
import ReqAJAX from '../my_modules/ReqAJAX';
import {MAIN_HOST} from '../my_modules/Settings';

import './GroupsList.css';

import { NavLink } from 'react-router-dom';

import GroupVK from './GroupVK';
import LoadAnimation from './LoadAnimation'

class GroupsList extends React.PureComponent {

    fetchError = (errorMessage) => {
        console.error(errorMessage);
    };
      
    fetchSuccess = (loadedData) => {
       console.log(loadedData);
       this.props.dispatch(groups_load(loadedData));

    };
    getAjaxData=new ReqAJAX(MAIN_HOST+"groups",this.fetchError,this.fetchSuccess);  

    componentWillMount(){
       console.log('Событие componentWillMount');
        this.getAjaxData.loadData();
    }

render() {
   
    if ( !this.props.groups.mode.dataReady )
        return <LoadAnimation/>;

    let groupsVKCode=[];

    for (let key in this.props.groups.all){
        let group=this.props.groups.all[key];
        groupsVKCode.push(
            <GroupVK 
                key={key}
                groupData={group}
            />
        );
    }

    let pagesLinksCode=[];
    for (let i=1;i<=this.props.groups.mode.countPages;i++){
        pagesLinksCode.push(<NavLink to={"/groupss/"+i} className="PageGroupLink" key={i}>{i}</NavLink>)
    }

    return(
        <div className='GroupsList'>
            {groupsVKCode}
        </div>
    );
  }

}

const mapStateToProps = function (state) {
     return {
      
      // весь раздел Redux state под именем counters будет доступен
      // данному компоненту как this.props.counters
      groups: state.groups,
    };
  };
  
export default connect(mapStateToProps)(GroupsList);