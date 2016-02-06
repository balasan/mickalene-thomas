import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
import Splash from '../containers/Splash';

class Menu extends Component {

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = '';
    var filters;
    const { toggleMenu } = this.props;
    // console.log(this.props, 'menu props')
    var showMenu = this.props.state.menu.showMenu;
    var location = this.props.state.routing.path;

    // const multi = function() {
    //   toggleMenu();
    //   var main = document.getElementById('main');
    //   if (main.classList.contains('hide')) {
    //   main.classList.remove('hide');
    //   } else {
    //     main.classList.add('hide');
    //   }

    // }

    var showHeader = true;
    if(location == '/' || showMenu)
      showHeader = false

    var links = null;

    if (showMenu) {
      links = (
        <section className='linksParent'>

          <div onClick={toggleMenu} className="linksBackground"></div>

          <header>
            <section className='left'></section>
            <section className='right'>
              <img onClick={toggleMenu} src='/images/close.svg' />
            </section>
          </header>

          <ReactCSSTransitionGroup className="links" transitionName="links" transitionAppear={true} transitionAppearTimeout={0} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            <Link className='menuLink' onClick={toggleMenu} to="/works">works</Link>
            <Link className='menuLink' onClick={toggleMenu} to="/about">about</Link>
            <Link className='menuLink' onClick={toggleMenu} to="/news">news</Link>
            <Link className='menuLink' onClick={toggleMenu} to="/store">store</Link>
          </ReactCSSTransitionGroup>

          <footer>
            <section className='left'>
              <Link className='footerLink' onClick={toggleMenu} to='https://www.instagram.com/'>
                <img src='../../images/insta-w.svg' />
              </Link>
              <Link className='footerLink' onClick={toggleMenu} to='https://www.facebook.com/'>
                <img src='../../images/fb-w-f.svg' />
              </Link>
            </section>
            <section className='right'>
              <Link className='footerLink' onClick={toggleMenu} to='/contact'>Contact</Link>
            </section>
          </footer>

        </section>
          )
    } else {
      null
    }

    return (
      <div>
        {links}
        <Splash></Splash>
      </div>
    )
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Menu)