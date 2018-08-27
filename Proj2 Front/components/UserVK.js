import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {user_invers_type_view} from '../redux/usersAC';
import {msToDateTime,platforms} from '../my_modules/fun';
import './UserVK.css';

class UserVK extends React.PureComponent {
    
/*
  static propTypes = {
    client:PropTypes.shape({
      id: PropTypes.number.isRequired,
      fam: PropTypes.string.isRequired,
      im: PropTypes.string.isRequired,
      otch: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      canEdit:PropTypes.boolean.isRequired,
    })
  };
  */
  inversFull=()=>{
    this.props.dispatch(user_invers_type_view(this.props.userData['key']));
    //console.log('клик на юзере')
  }

  render(){
    //console.log(this.props.userData['maiden_name']);
    return (
    <div className={'userVK '+this.props.userData.action['type']}>{
    (!this.props.userData['deactivated'])?(  
        <div>
          <div className='userPhoto'>
            <a href={'https://vk.com/'+this.props.userData['domain']} target="_blank">
              <img
                src={this.props.userData['photo_100']}
              />
            </a>
          </div>
          <div className='userInfo'>
            <div className='shot'>
              <div className='userName'>
                <a href={'https://vk.com/'+this.props.userData['domain']} target="_blank">
                {this.props.userData['first_name']+' '+this.props.userData['last_name']}
                {(this.props.userData['maiden_name'])&&<span className='maidenName'>{' ('+this.props.userData['maiden_name']+') '}</span>}
                </a>
              </div>
              <div className='userId'>
                <div className='label'>
                  {'ID пользователя:'}
                </div>
                <div className='info'>
                  {this.props.userData['id']}
                </div>
              </div>
              {(this.props.userData['home_town'])&&!(this.props.userData['home_town']=='не указан')&&
              <div className='homeTown'>
                <div className='label'>
                  {'Родной город:'}
                </div>
                <div className='info'>
                  {this.props.userData['home_town']}
                </div>
              </div>}
              {(this.props.userData['occupation_name'])&&
              <div className='occupation'>
                <div className='label'>
                  {this.props.userData['occupation_type']+':'}
                </div>
                <div className='info'>
                  {this.props.userData['occupation_name']}
                </div>
              </div>}
              {(this.props.userData['site'])&&
              <div className='site'>
                <div className='label'>
                  {'Сайт:'}
                </div>
                <div className='info'>
                  <a href={this.props.userData['site']} target="_blank">{this.props.userData['site']}</a>
                </div>
              </div>}
              {(!this.props.userData['isFullView'])&&(
                <input type='button' value='Подробнее...' onClick={this.inversFull}/>
              )}
            </div>
          <div className={'fullView'+((this.props.userData['isFullView'])?(' onView'):(' offView'))}>
            <div className='followersCount'>
              <div className='label'>
                {'Количество подписчиков:'}
              </div>
              <div className='info'>
                {this.props.userData['followers_count']}
              </div>
            </div>
            {(this.props.userData['bdate'])&&
              <div className='bdate'>
                <div className='label'>
                  {'Дата рождения:'}
                </div>
                <div className='info'>
                  {this.props.userData['bdate']}
                </div>
              </div>}
            <div className='lastSeen'>
              <div className='label'>
                {'Последнее посещение:'}
              </div>
              <div className='info'>
                {msToDateTime(this.props.userData['last_seen_time'])+' с платформы: '+platforms[this.props.userData['last_seen_platform']]}
              </div>
            </div>
            {(this.props.userData['home_phone'])&&
            <div className='homePhone'>
              <div className='label'>
                {'Домашний телефон:'}
              </div>
              <div className='info'>
                {this.props.userData['home_phone']}
              </div>
            </div>}
            {(this.props.userData['mobile_phone'])&&
            <div className='mobilePhone'>
              <div className='label'>
                {'Мобильный телефон:'}
              </div>
              <div className='info'>
                {this.props.userData['mobile_phone']}
              </div>
            </div>}
          <div className='socialNetworks'>
            <p className='facebook'><span className='socialIcon'></span> {this.props.userData['facebook']}</p>
            <p className='skype'><span className='socialIcon'></span>{this.props.userData['skype']}</p>
            <p className='twitter'><span className='socialIcon'></span>{this.props.userData['twitter']}</p>
            <p className='instagram'><span className='socialIcon'></span>{this.props.userData['instagram']}</p>
          </div>
          {(this.props.userData['isFullView'])&&(
                <input type='button' value='Скрыть подробности...' onClick={this.inversFull}/>
            )}
        </div>
      </div>
      </div> 
      ):(<div>Страница пользователя удалена</div>)
    }</div>  
    )};    
};

//export default UserVK

const mapStateToProps = function (state) {
  return {

  };
};

export default connect(mapStateToProps)(UserVK);
