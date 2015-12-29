import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Menu from '../components/Menu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MenuActions from '../actions/menu';
import Splash from './Splash';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if(process.env.BROWSER){
  require('./../../client/css/animation.css');
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
}
export default class App extends Component {
  // static fetchMenu(dispatch, length) {
  //   var { loadMenu } = bindActionCreators(MenuActions, dispatch, length)

  //   return Promise.all([
  //     loadMenu(length)
  //   ])
  // }

  // componentDidMount() {
  //     this.constructor.fetchMenu(this.props.dispatch, this.props.location.pathname.length);
  // }

  render () {
    if (this.props.menu) {
      if (!this.props.menu.showMenu) {
        var main = (
          <main>
           <ReactCSSTransitionGroup component='div' transitionName="main" transitionAppear={true}
              transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.props.children}
       </ReactCSSTransitionGroup>
          </main>)
      } else {
        var main = null;
      }
    }

    return (
    <div>
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
