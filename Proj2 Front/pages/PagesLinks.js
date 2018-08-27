import React from 'react';
import PropTypes from 'prop-types';
import {IndexLink, NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {change_users_page} from '../redux/usersAC';

import './PagesLinks.css';


class PagesLinks extends React.Component {
          
  render() {

    return (
      <div>
        <NavLink to="/" exact className="PageLink" activeClassName="ActivePageLink" >Группы</NavLink>
        {/* <IndexLink to="/" exact className="PageLink" activeClassName="ActivePageLink" >Группы</IndexLink>  */}
        <NavLink to={'/users/'+this.props.groups.currentGroup+'/1'} className="PageLink" activeClassName="ActivePageLink" >Пользователи</NavLink>
        <NavLink to="/control" className="PageLink" activeClassName="ActivePageLink" >Управление</NavLink>
      </div>
    );
    
  }

}
const mapStateToProps = function (state) {
  return {
   // весь раздел Redux state под именем counters будет доступен
   // данному компоненту как this.props.groups
   groups: state.groups,
 };
};    
//export default PagesLinks;
export default connect(mapStateToProps)(PagesLinks);
    