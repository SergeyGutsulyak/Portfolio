import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {groups_load} from '../redux/groupsAC';
import './FormAddGroup.css';
import ReqAJAX from '../my_modules/ReqAJAX';
import {MAIN_HOST} from '../my_modules/Settings';
import { withRouter } from 'react-router-dom';
class FormAddGroup extends React.PureComponent {
    
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
    refLinkGroup=null;
    refCheckScan=null;
    refPeriodScan=null;
    
    setLinkGroup=(ref)=>{
        this.refLinkGroup=ref;
    }

    setCheckScan=(ref)=>{
        this.refCheckScan=ref;
    }

    setPeriodScan=(ref)=>{
        this.refPeriodScan=ref;
    }
    
    getLinkGroup=()=>{
        if (this.refLinkGroup){
            return this.refLinkGroup.value;
        }
    }

    getCheckScan=()=>{
        if (this.refCheckScan){
          return this.refCheckScan.checked;
        }
    }

    getPeriodScan=()=>{
        if (this.refPeriodScan){
          return this.refPeriodScan.value;
        }
    }

    fetchError = (errorMessage) => {
        console.error(errorMessage);
    };
    
    fetchSuccess = (loadedData) => {
        console.log(loadedData);
        if (loadedData['statusOK']){
            alert('Группа успешно добавлена');
            this.props.dispatch(groups_load(loadedData));
        }
        else{
            alert('При добавлении на сервере возникли проблемы, возможно группы с такой ссылкой не существует');
        }
        
    };
    getAjaxData=new ReqAJAX(MAIN_HOST+"addgroup",this.fetchError,this.fetchSuccess);  

    addGroup=()=>{
        //console.log('Нажата кнопка добавить');
        //console.log(this.getLinkGroup());
        //console.log(this.getCheckScan());
        //console.log(this.getPeriodScan());
        
        var textInput=this.getLinkGroup();
        var arrTextInput=textInput.split('/');
        var groupLink=arrTextInput[arrTextInput.length-1];
        if (groupLink.length==0){
            alert('Неправильный формат адреса');
            return 
        }
        var checkScan=this.getCheckScan();
        var periodScan=this.getPeriodScan();
        if (checkScan){
            if (periodScan<=0){
                alert('Периорд сканирования должен быть больше нуля');
                return 
            }
        }
        else periodScan=24;
        this.getAjaxData.setBody({'screen_name':groupLink,'on_scan':checkScan,'periodScan':periodScan});
        this.getAjaxData.loadData();
    }
    clickChek=()=>{
        if (this.refCheckScan||this.refPeriodScan){
            if (this.getCheckScan()){
                this.refPeriodScan.disabled=false;
            }else{
                this.refPeriodScan.disabled=true;
            }
        }
    }
    test=()=>{
        console.log(this.props)
        this.props.history.push('/')
    }
    render(){
       return (
        <div className='FormAddGroup'>
            <label>
                <span className='labelText'>
                    {'Добавить группу:'}
                </span>
                <input type='text'
                    ref={this.setLinkGroup}
                />
            </label>
            <br/>
            <label>
                <span className='labelText'>
                    {'Установить на сканирование:'}
                </span>
                <input type='checkbox'
                       ref={this.setCheckScan}
                       onClick={this.clickChek}
                />
            </label>
            <br/>
            <label className='periodScan'>
                <span className='labelText'>
                    {'Период опроса, в часах:'}
                </span>
                <input type='number'
                    defaultValue='24'
                    ref={this.setPeriodScan}
                    disabled={true}                   
                />
            </label>
            <br/>
            <input type='button'
                    value='Добавить'
                    onClick={this.addGroup}
            />
        </div>
      )};    
  };
  
  //export default FormAddGroup
  const mapStateToProps = function (state) {
    return {
   };
 };
 
export default connect(mapStateToProps)(FormAddGroup);