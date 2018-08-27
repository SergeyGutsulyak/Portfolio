
import React from 'react';

//import {connect} from 'react-redux';
import GroupsList from '../components/GroupsList';

class Page_Groups extends React.PureComponent {

  render() {
    console.log('render PageGroups');
        
    //page={this.props.match.params.page}
    return (
          <GroupsList />
    );
  }
}
/*
const mapStateToProps = function (state) {
  // этому компоненту ничего не нужно из хранилища Redux
  return { }; 
};


export default connect(mapStateToProps)(Page_Groups);
*/
export default Page_Groups;    
