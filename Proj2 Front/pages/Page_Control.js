import React from 'react';

//import {connect} from 'react-redux';
import ControlBox from '../components/ControlBox';

class Page_Control extends React.PureComponent {
  
  render() {
    //console.log('render PageUsers')
    console.log(this.props)
    //page={this.props.match.params.page}
    return (
          <ControlBox/>
    );
  }
}
/*
const mapStateToProps = function (state) {
  // этому компоненту ничего не нужно из хранилища Redux
  return { }; 
};


export default connect(mapStateToProps)(Page_Users);
*/

export default Page_Control;