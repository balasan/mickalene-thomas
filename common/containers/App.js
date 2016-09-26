import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MenuActions from '../actions/menu';
import Splash from './Splash';
import Cart from '../components/Cart';
import Loader from '../components/Loader';

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
  require('./../../client/css/mag.css');
  require('./../../client/css/checkout.css');
  window.jQuery = window.$ = require('jquery');
  require('jquery.payment');
}

class App extends Component {
  render () {
    var cartHash = this.props.location.hash == '#cart';
    var styles = 'main-container';
    if (cartHash) styles = 'main-container hideapp';
    if (this.props.menu) {
        var key = this.props.menu.showMenu;
        if (this.props.location.pathname.match('store')) {
          key += this.props.location.pathname;
        }
        var main = (
           <ReactCSSTransitionGroup component='main' className={styles} transitionName="main"
            transitionAppear = {true}
            transitionAppearTimeout = {1000}
            transitionEnterTimeout = {1000}
            transitionLeaveTimeout = {500}>
              <div className='mainContainerInside' key={key}>
                {!this.props.menu.showMenu ? React.cloneElement(this.props.children) : null}
              </div>
            </ReactCSSTransitionGroup>);
    }

  return (
    <div>
      <Nav { ...this.props }></Nav>
      <Menu { ...this.props }></Menu>
      {main}
      <Cart { ...this.props }/>
      <Loader { ...this.props }></Loader>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu,
    state: state
  }
}

export default connect(mapStateToProps,{})(App)
