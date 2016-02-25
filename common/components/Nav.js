import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
import { updatePath } from 'redux-simple-router';
var classNames = require('classnames');

class Nav extends Component {

  static fetchWorkTags(dispatch) {
    var { loadWorkTags } = bindActionCreators(MenuActions, dispatch)
    return Promise.all([
      loadWorkTags()
    ])
  }

  static fetchNewsTags(dispatch) {
    var { loadNewsTags } = bindActionCreators(MenuActions, dispatch)
    return Promise.all([
      loadNewsTags()
    ])
  }

  componentDidMount() {
    this.constructor.fetchWorkTags(this.props.dispatch);
    this.constructor.fetchNewsTags(this.props.dispatch);
  }

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = '';
    var filters = null;
    var mobileFilters = null;
    const { toggleMenu, toggleExpand } = this.props;
    var expand = this.props.state.menu.expand;
    var showMenu = this.props.state.menu.showMenu;
    var location = this.props.children.props.route.path;
    var self = this;
    // console.log(this.props, 'nav ')


    const closeItem = function() {
       self.props.dispatch(updatePath('/works'))
    }


    // const multi = function() {
    //   toggleMenu();
    //   // var main = document.getElementById('main');
    //   // if (main.classList.contains('hide')) {
    //   // main.classList.remove('hide');
    //   // } else {
    //   //   main.classList.add('hide');
    //   // }

    // }

    const toggleCart = function() {
      var cartHash = window.location.hash == '#cart';
      if (!cartHash)
        window.location.hash = '#cart';
      else
        window.location.hash = '';
    }

    var showHeader = true;
    if(!path || showMenu)
      showHeader = false

    if (!process.env.BROWSER) showHeader = false;

    var workTags = [];
    var newsTags = [];

    if (this.props.state.menu) {
      if (this.props.state.menu.workTags) workTags = this.props.state.menu.workTags;
      if (this.props.state.menu.newsTags) newsTags = this.props.state.menu.newsTags;
    }

    if (path == 'store/:itemId') {
      filters = (
        <section className='filterLinks'>
        <Link to='/store'>back to products</Link>
         </section>
        )
    }

    if (path == 'works/filter/:filter') {

      filters = (
        <section className='filterLinks'>
          <Link className={!filterType ? 'selected' : null} to='/works'>back to works</Link>
        </section>);

      mobileFilters = (
        <div>
        {workTags.map(function (filter, i) {
            return (
                <Link
                  key={i}
                  className={filterType == filter ? 'selected' : null}
                  onClick={toggleExpand}
                  to={'/works/filter/' + filter}
                  >
              {filter}
              </Link>
            )}, this)}
        </div>
        )
    }

    if (path == 'news' || path == 'news/filter/:filter') {
      filters = (
        <section className='filterLinks'>
        <Link
          className={!filterType ? 'selected' : null} to='/news'>all</Link>
          {newsTags.map(function (filter, i) {
            return (
                <Link key={i}
                  className={filterType == filter ? 'selected' : null}
                  to={'/news/filter/' + filter}>
              {filter}
              </Link>
            )}, this)}
         </section>
        )
      mobileFilters = (
        <div>
        {newsTags.map(function (filter, i) {
            return (
                <Link
                  key={i}
                  className={filterType == filter ? 'selected' : null}
                  onClick={toggleExpand}
                  to={'/news/filter/' + filter}
                  >
              {filter}
              </Link>
            )}, this)}
        </div>
        )
    }

    var itemPage = this.props.location.pathname.substr(0,8) == '/works/i' ? true : false;
    if(itemPage) showHeader = false;

    if (showHeader) {
        if (path == 'works/filter/:filter') {
          location = (<p>{filterType}</p>);
        } else if (path == 'news/filter/:filter') {
          location = (<p>news</p>);
        } else if (path == 'store/:itemId') {
          location = (<Link to='/store'>store</Link>);
        } else {
          location = (<p>{path}</p>);
        }


    var navClass = classNames({
      'transparent': itemPage,
      'expand': expand
    });
    var bottomClass = classNames({
      'expand bottom': expand,
      'bottom': !expand
    })

    var cart = null;


    if (this.props.state.store.cart) {
      if (path == 'store' ||  path == 'store/:itemId' ||  path == 'cart') {
        var totalItems = 0;
        this.props.state.store.cart.forEach(function(item) {
          totalItems += item.quantity;
        })
        cart = (
          <a onClick={toggleCart} className='cart-icon noselect'>
          <img className="noselect" src="../../images/cart.svg" />
          <p className="noselect">{'X ' + totalItems}</p>
          </a>
        )
      } else if (this.props.state.store.cart.length > 0) {
        var totalItems = 0;
        this.props.state.store.cart.forEach(function(item) {
          totalItems += item.quantity;
        })
        cart = (
          <a onClick={toggleCart} className='cart-icon noselect'>
          <img className="noselect" src="../../images/cart.svg" />
          <p className="noselect">{'X ' + totalItems}</p>
          </a>
        )
      }
    }

      var nav = (
          <nav className={navClass} >
            <div className='top'>
            <section className='left'>
              {path == 'works/i/:itemId' ? null : <Link className='logo' to="/">mickalene thomas</Link>}
              {path == 'works' || path == 'works/' || path == 'works/filter/:filter' || path == 'news/' || path == 'news' || path == 'news/filter/:filter' ? <Link to='/works' className='back'></Link> : null}
              {path == 'store/:itemId' ? <Link to='/store' className='back'></Link> : null}
            </section>
            <section className='middle'>
              {itemPage ? null : location}
              {itemPage ? null : filters}
            </section>
            <section className='right'>
            {cart}

            <img className={'hamburger noselect'} onClick={toggleMenu} src={'../../images/menu.svg'} />

            </section>
            </div>
            {/*<div className={bottomClass}>
            {mobileFilters}
            </div> */}
          </nav>
        )
    }
    else nav = (<nav className="hidden"></nav>)

    return (
      <div className="noselect">
{/*       <ReactCSSTransitionGroup
        transitionName="nav"
        transitionAppear={true}
        transitionAppearTimeout={0}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={500}> */}
          {nav}
{/*       </ReactCSSTransitionGroup>
 */}
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
  })(Nav)
