import React from 'react';
import PropTypes from 'prop-types';
import './GroupVK.css';
import {msToDateTime} from '../my_modules/fun';
import { NavLink } from 'react-router-dom';
class GroupVK extends React.PureComponent {
    
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
    render(){
      //console.log(this.props.userData['maiden_name']);
      return (
        <div className='groupVK'>
            <div className='groupPhoto clearfix'>
              <a href={'https://vk.com/'+this.props.groupData['screen_name']} target="_blank">
                <img
                  src={this.props.groupData['photo_100']}
                />
              </a>
            </div>
            <div className='groupInfo'>
                <div className='groupName'>
                  <a href={'https://vk.com/'+this.props.groupData['screen_name']} target="_blank">
                  {this.props.groupData['name']}
                  </a>
                </div>
                <div className='startScan'>
                    {'Начало сканирования: '}
                    <span className='scanTime'>
                        {msToDateTime(this.props.groupData['start_scan_time'])}
                    </span>
                </div>
                <div className='periodScan'>
                        {'Период сканирования: '}
                        {this.props.groupData['period_scan']/60+' ч.'}
                </div>
                <div className='lastScan'>
                    {'Последнее сканирование: '}
                    <span className='scanTime'>
                        {msToDateTime(this.props.groupData['last_scan'])}
                    </span>
                </div>
                <div className='status'>
                    {(this.props.groupData['on_scan'])?
                        (<span className='scanON'>Сканирование включено</span>):
                        (<span className='scanOFF'>Сканирование отключено</span>)
                    }
                </div>
                <div>
                  <NavLink to={"/users/"+this.props.groupData['id']+'/1'} className="PageUserLink" key={this.props.groupData['id']}>{'Посмотреть пользователей'}</NavLink>
                </div>

            </div>
        </div>
      )};    
  };
  
  export default GroupVK