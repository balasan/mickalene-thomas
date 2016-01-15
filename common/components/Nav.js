import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
import { updatePath } from 'redux-simple-router';
var classNames = require('classnames');

export default class Nav extends Component {

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
    // this.expand = false;
    // console.log(this, 'did mount this')
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
    var showMenu = this.props.menu.showMenu;
    var location = this.props.state.routing.path;
    var self = this;

    console.log(this.props, 'nav props')

    const closeItem = function() {
       self.props.dispatch(updatePath('/works'))
    }

    var showHeader = true;
    if(location == '/' || showMenu)
      showHeader = false

    var workTags = [];
    var newsTags = [];

    if (this.props.menu) {
      if (this.props.menu.workTags) {
        workTags = this.props.menu.workTags;
      }
      if (this.props.menu.newsTags) {
        newsTags = this.props.menu.newsTags;
      }
    }

    if (path == 'works/filter/:filter' || path == 'works') {
      filters = (
        <section className='filterLinks'>
        <Link
          className={!filterType ? 'selected' : null} to='/works'>all</Link>
          {workTags.map(function (filter, i) {
            return (
                <Link key={i}
                  className={filterType == filter ? 'selected' : null}
                  to={'/works/filter/' + filter}>
              {filter}
              </Link>
            )}, this)}
         </section>
      )
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
    }

    if (showHeader) {
        if (path == 'works/filter/:filter') {
          location = (<p>works</p>);
        } else if (path == 'news/filter/:filter') {
          location = (<p>news</p>);
        } else {
          location = (<p>{path}</p>);;
        }

      var itemPage = this.props.location.pathname.substr(0,8) == '/works/i' ? true : false;

    var navClass = classNames({
      'transparent': itemPage,
      'expand': expand
    });
    var bottomClass = classNames({
      'expand bottom': expand,
      'bottom': !expand
    })

    var cart = null;

    if (path == 'store' && this.props.state.store.cart) {
      cart = (
        <div className='cart'>
        <img src="../../images/cart.svg" />
        <p>{'X ' + this.props.state.store.cart.length}</p>
        </div>
        )
    }

      var nav = (
        <ReactCSSTransitionGroup transitionName="nav" transitionAppear={true} transitionAppearTimeout={0} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          <nav className={navClass}>
            <div className='top'>
            <section className='left'>
              {path == 'works/i/:itemId' ? null : <Link to="/">mickalene thomas</Link>}
              {path == 'works' || path == 'works/' || path == 'works/filter/:filter' ? <p onClick={toggleExpand}>filter</p> : null}
            </section>
            <section className='middle'>
              {itemPage ? null : location}
              {itemPage ? null : filters}
            </section>
            <section className='right'>
            {cart}

              <img className={itemPage ? 'close' : ''} onClick={itemPage ? closeItem : toggleMenu} src={itemPage ? '../../images/close.svg' : '../../images/menu.svg'} />
            }
            }
            </section>
            </div>
            <div className={bottomClass}>
            {mobileFilters}
            </div>
          </nav>
        </ReactCSSTransitionGroup>)

       }

    return (
      <div>
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