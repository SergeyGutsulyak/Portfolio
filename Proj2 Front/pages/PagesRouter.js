import React from 'react';
import PropTypes from 'prop-types';
import { Router,Route} from 'react-router-dom';
//import { syncHistoryWithStore, routerReducer,hashHistory } from 'react-router-redux';

//import { Provider } from 'react-redux';
//import { createStore } from 'redux';
//import combinedReducer from '../redux/reducers.js';

//let store=createStore(combinedReducer);

//const history = syncHistoryWithStore(hashHistory, store);

//import Page_About from './Page_About';
import Page_Users from './Page_Users';
import Page_Groups from './Page_Groups';
import Page_Control from './Page_Control';

class PagesRouter extends React.Component {
          
  render() {

    return (
      // <Provider store={store}>
        <div>
          {/* <Router history={history}> */}
            <Route path="/" exact component={Page_Groups} /> 
            <Route path="/users/:idGroup/:page" component={Page_Users} />
            <Route path="/control" component={Page_Control} /> 
          {/* </Router> */}
        </div>
      // </Provider>
    );
  }

}
    
export default PagesRouter;
    