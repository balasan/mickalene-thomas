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
    var self = this;
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = '';
    var filters = null;
    var mobileFilters = null;
    const { toggleMenu, toggleExpand } = this.props;
    var expand = this.props.state.menu.expand;
    var showMenu = this.props.state.menu.showMenu;
    var location = this.props.children.props.route.path;
    var workTags = [];
    var newsTags = [];
    var cart = null;
    var showHeader = true;
    var cartHash = null;
    var itemPage = this.props.location.pathname.substr(0,8) == '/works/i' ? true : false;
    var itemId = self.props.params.itemId;
    var worksObj = null;
    var exhibitionTitle = '';
    var exhib = false;
    var currentItem = null;
    var itemTitle = null;

    if (self.props.state.works.obj) {
      if (self.props.state.works.obj) worksObj = self.props.state.works.obj;
    }

    if (itemId) {
      if (worksObj) {
        if (worksObj[itemId]) {
          if (worksObj[itemId].tags[0] == 'exhibitions') {
            showHeader = true;
            exhibitionTitle = worksObj[itemId].title;
            exhib = true;
          } else {
            showHeader = false;
          }
        }
      }
    }

    const closeItem = function() {
       self.props.dispatch(updatePath('/works'))
    }

    const toggleCart = function() {
      cartHash = window.location.hash == '#cart';
      if (!cartHash)
        window.location.hash = '#cart';
      else
        window.location.hash = '';
    }

    if(!path || showMenu) showHeader = false
    if (!process.env.BROWSER) showHeader = false;
    if (self.props.params.imageId) showHeader = false;

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

    if (path == 'works/exhibitions/:itemId') {
      filters = (
        <section className='filterLinks'>
          <Link  to='/works/filter/exhibitions'>back to exhibitions</Link>
        </section>);
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

    if (showHeader) {

      if (path == 'works/filter/:filter') {
        location = (<p>{filterType}</p>);
      } else if (path == 'news/filter/:filter') {
        location = (<p>news</p>);
      } else if (path == 'store/:itemId') {
        location = (<Link to='/store'>store</Link>);
      } else if (path == 'works/exhibitions/:itemId' || path == 'works/exhibitions/:itemId/:imageId') {
        location = (<p>{exhibitionTitle}</p>);
      } else {
        location = (<p>{path}</p>);
      }

      var navClass = classNames({
        'transparent': itemPage || path == 'works/exhibitions/:itemId/:imageId',
        'expand': expand,
        'border-bottom': path == 'store'
      });
      var bottomClass = classNames({
        'expand bottom': expand,
        'bottom': !expand
      })

      if (this.props.state.store.cart) {
        if (path == 'store' ||  path == 'store/:itemId' ||  path == 'cart') {
          var totalItems = 0;
          this.props.state.store.cart.forEach(function(item) {
            totalItems += item.quantity;
          })
          cart = (
            <a onClick={toggleCart} className='cart-icon noselect'>
            <img className="noselect" src="/images/cart.svg" />
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
            <img className="noselect" src="/images/cart.svg" />
            <p className="noselect">{'X ' + totalItems}</p>
            </a>
          )
        }
      }

      var nav = (
        <nav className={navClass}>
          <div className='top'>
          <section className='left'>
            {path == 'works/i/:itemId' || path == 'works/exhibitions/:itemId/:imageId' ? null : <Link className='logo' to="/">mickalene thomas</Link>}
            {path == 'works/filter/:filter' || path == 'news/' || path == 'news' || path == 'news/filter/:filter' ? <Link to='/works' className='back'></Link> : null}
            {path == 'works/exhibitions/:itemId' ? <Link to='/works/filter/exhibitions' className='back'></Link> : null}
            {path == 'store/:itemId' ? <Link to='/store' className='back'></Link> : null}
          </section>
          <section className='middle'>
            {itemPage ? null : location}
            {itemPage ? null : filters}
          </section>
          <section className='right'>
          {cart}
          <img className={'hamburger noselect'} onClick={toggleMenu} src={'/images/menu.svg'} />
          </section>
          </div>
        </nav>
      )
    } else {
      nav = (<nav className="hidden"></nav>);
    }

    return (
      <div className="noselect">
        {nav}
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
