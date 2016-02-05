import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MenuActions from '../actions/menu';
import Splash from './Splash';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if (process.env.BROWSER) {
  require('./../../client/css/flex-images.css');
  require('./../../client/css/index.css');
  require('./../../client/css/links.css');
  require('./../../client/css/work.css');
  require('./../../client/css/about.css');
  require('./../../client/css/news.css');
  require('./../../client/css/store.css');
  require('./../../client/css/contact.css');
  require('./../../client/css/item.css');
  require('./../../client/css/navbar.css');
  require('./../../client/css/animation.css');
}

class App extends Component {
  render () {
    if (this.props.menu) {
        var main = (
           <ReactCSSTransitionGroup component='main' className='main-container' transitionName="main" 
            transitionAppear={true}
            transitionAppearTimeout={1000} 
            transitionEnterTimeout={1000} 
            transitionLeaveTimeout={500}>
              {!this.props.menu.showMenu ? this.props.children : null}
            </ReactCSSTransitionGroup>);
    }

    return (
    <div>
      <Nav { ...this.props }></Nav>
      <Menu { ...this.props }></Menu>
      <Splash></Splash>
      {main}
    </div>
    );
  }
}

export default connect(
  state => {
    return {menu: state.menu}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(App)


// export default App
