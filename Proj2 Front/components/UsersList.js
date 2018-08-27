import React from 'react';
import {connect} from 'react-redux';
import {change_count_users_on_page,set_filtr_all,set_filtr_add,set_filtr_del} from '../redux/usersAC';

import { withRouter } from 'react-router-dom';
import './UsersList.css';
import {delHourMinSec,formatDate} from '../my_modules/fun';
import { NavLink } from 'react-router-dom';
import UserVK from './UserVK';
import LoadAnimation from './LoadAnimation'
class UsersList extends React.PureComponent {


componentWillReceiveProps(newProps){
    //console.log('Событие componentWillReceiveProps UsersList');
    //console.log(newProps)
    
    if (newProps.match.params.page>Math.ceil((newProps.users.filtr.length)/newProps.users.mode.usersOnPage)){
        //newProps.history.pop()
        //newProps.history.push('/users/'+this.props.match.params.idGroup+'/1')
        newProps.history.replace('/users/'+this.props.match.params.idGroup+'/1')
        newProps.match.params.page=1
    }
    
    //console.log(this.props);
    /*
    if (newProps.match.params.page!=this.props.match.params.page){
        this.props.dispatch(change_users_page(1));
    }*/
    //this.props.dispatch(change_users_page(1));
}

componentWillMount(){
   console.log('Событие componentWillMount  UsersList');

   //this.getAjaxData.loadData();
}
changeCountUsersOnPage=(e)=>{
    this.props.dispatch(change_count_users_on_page(e.target.value))
    this.props.history.push('/users/'+this.props.match.params.idGroup+'/1')
    //console.log(e.target.value)
}
setFiltrAll=()=>{
   this.props.dispatch(set_filtr_all())
   console.log(this.props)
   this.props.history.push('/users/'+this.props.match.params.idGroup+'/1')
}
setFiltrAdd=()=>{
    this.props.dispatch(set_filtr_add())
    this.props.history.push('/users/'+this.props.match.params.idGroup+'/1')
}

setFiltrDel=()=>{
    this.props.dispatch(set_filtr_del())
    this.props.history.push('/users/'+this.props.match.params.idGroup+'/1')
}
 

render() {
    //console.log('Номер страницы при рендере UsersList:'+this.props.match.params.page);
    if ( this.props.match.params.idGroup==0)
        return <div>
                Группа не выбрана, выберете группу <a href='/'>Здесь</a>
               </div>;

    if ( !this.props.users.mode.dataReady )
        return <LoadAnimation/>;

    let usersVKCode=[];

    let curPage=this.props.match.params.page;
    let usersOnPage=this.props.users.mode.usersOnPage;
    let sliceArr=this.props.users.filtr.slice(usersOnPage*(curPage-1),usersOnPage*curPage)
    //обнуление часы, минуты....
    let prevDate=delHourMinSec(sliceArr[0].action.date);
    //console.log(sliceArr[0]);
    usersVKCode.push(<div
            key={formatDate(prevDate)}
            className="Date"
            ><span> {formatDate(prevDate)}<br/></span>
        </div>
    );

    for (let key in sliceArr){
        //console.log(key)
        let user=sliceArr[key];
        let curDate=delHourMinSec(user.action.date);
        if (curDate.valueOf()!=prevDate.valueOf()){
            usersVKCode.push(<div
                key={formatDate(curDate)}
                className="Date"
                ><span> {formatDate(curDate)}<br/></span>
            </div> );
            prevDate=curDate;    
        }
        usersVKCode.push(
            <UserVK 
                key={user['key']}
                userData={user}
            />
        );
    }

    let pagesLinksCode=[];

    let countPages=Math.ceil(this.props.users.filtr.length/usersOnPage);

    for (let i=1;i<=countPages;i++){
        
        let lnk=<div key={i} className="PageLinkSmall">
                    <NavLink 
                        to={"/users/"+this.props.match.params.idGroup+'/'+i}
                        className="PageUserLink"
                        activeClassName="ActivePageLink"
                        >
                        {i}
                    </NavLink>
                    <div className="UnderLink"></div>
                </div>
        pagesLinksCode.push(lnk);
    }

    return(
        <div className='UsersList'>
            <div className="ControlPanel">
                <input 
                    type='button'
                    value='Все'
                    onClick={this.setFiltrAll}
                />

                <input 
                    type='button'
                    value='Новые'
                    onClick={this.setFiltrAdd}
                />
                <input 
                    type='button'
                    value='Ушедшие'
                    onClick={this.setFiltrDel}
                />
                <div className="SelectCountOnPage"> <span>Количество на странице: </span>
                    <select defaultValue={usersOnPage} onChange={this.changeCountUsersOnPage}>
                        <option value='10' >10</option>
                        <option value='20' >20</option>
                        <option value='50' >50</option>
                    </select>
                </div>
            </div>
            <div className="LinksPages">
                {pagesLinksCode}
            </div>
            <div className='UsersContainer'>
                {usersVKCode}
            </div>
            <div className="LinksPages">
                {pagesLinksCode}
            </div>
        </div>
        
    );
  }

}


const mapStateToProps = function (state) {
    //console.log(state);
    return {
      
      // весь раздел Redux state под именем counters будет доступен
      // данному компоненту как this.props.counters
      users: state.users,
    };
  };
  
export default connect(mapStateToProps)(withRouter(UsersList));

