import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
// import Splash from '../containers/Splash';
import Video from './Video';

import { fetchContact } from '../api/contact';

class Menu extends Component {


  componentDidMount() {
    var self = this;
    fetchContact(function(i, data) {
      self.contactData = data;
      self.render();
    });
    this.socialEl = false;
  }

  componentDidUpdate() {
    var self = this;
    fetchContact(function(i, data) {
      self.contactData = data;
      self.render();
    });
  }


  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = '';
    var filters;
    const { toggleMenu } = this.props;
    var showMenu = this.props.state.menu.showMenu;
    var location = this.props.state.routing.path;

    var showHeader = true;
    if(location == '/' || showMenu)
      showHeader = false

    var links = null;

    var socialEl = null;
    if (this.contactData && !this.socialEl) {
      var socialEl = (
        <div>
          <a target='_blank' className='footerLink noselect' onClick={toggleMenu} href={this.contactData.studio.fb}>
            <img src='../../images/fb-w-f.svg' />
          </a>
          <a target='_blank' className='footerLink noselect' onClick={toggleMenu} href={this.contactData.studio.twitter}>
            <img src='../../images/twitter_menu.svg' />
          </a>
          <a target='_blank' className='footerLink noselect' onClick={toggleMenu} href={this.contactData.studio.insta}>
            <img src='../../images/insta-w.svg' />
          </a>
        </div>
      )
    }


    if (showMenu) {
      links = (
        <section className='linksParent'>

          <div onClick={toggleMenu} className="linksBackground"></div>

          <header>
            <section className='left'></section>
            <section className='right'>
              <img className="noselect" onClick={toggleMenu} src='/images/close.svg' />
            </section>
          </header>

          <ReactCSSTransitionGroup className="links" transitionName="links" transitionAppear={true} transitionAppearTimeout={0} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            <Link className='menuLink noselect' onClick={toggleMenu} to="/works">works</Link>
            <Link className='menuLink noselect' onClick={toggleMenu} to="/about">about</Link>
            <Link className='menuLink noselect' onClick={toggleMenu} to="/news">news</Link>
            <Link className='menuLink noselect' onClick={toggleMenu} to="/store">store</Link>
          </ReactCSSTransitionGroup>

          <footer>
            <section className='left'>
            {socialEl}
            </section>
            <section className='right'>
              <Link className='footerLink noselect' onClick={toggleMenu} to='/contact'>Contact</Link>
            </section>
          </footer>

        </section>
          )
    } else {
      null
    }

    var video = null;
    if(showMenu && !window.mobilecheck()){
       video = (<Video videoid="vidBg"></Video>)
    }

    return (
      <div>
        {links}
{/*          <Splash></Splash> */}
       {video}
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      routing: state.routing,
      menu: state.menu
    }
  },
  dispatch => {
    return bindActionCreators(MenuActions, dispatch)
  })(Menu)