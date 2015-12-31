import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'

export default class Nav extends Component {

  static fetchTags(dispatch) {
    var { loadTags } = bindActionCreators(MenuActions, dispatch)
    return Promise.all([
      loadTags()
    ])
  }

  componentDidMount() {
      this.constructor.fetchTags(this.props.dispatch);
  }

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = '';
    var filters;
    const { toggleMenu } = this.props;
    var showMenu = this.props.menu.showMenu;
    var location = this.props.state.routing.path;

    var showHeader = true;
    if(location == '/' || showMenu)
      showHeader = false

    var tags = [];

    if (this.props.menu) {
      if (this.props.menu.tags) {
        tags = this.props.menu.tags;
      }
    }

    if (path == 'works/filter/:filter' || path == 'works' && tags) {
      filters = (
        <section className='filterLinks'>
        <Link
          className={!filterType ? 'selected' : null} to='/works'>all</Link>
          {tags.map(function (filter, i) {
            return (
                <Link key={i}
                  className={filterType == filter ? 'selected' : null}
                  to={'/works/filter/' + filter}>
              {filter}
              </Link>
            )}, this)}
         </section>
      )
    }

    if (showHeader) {
        if (path == 'works/filter/:filter') {
          location = (<p>works</p>);
        } else {
          location = (<p>{path}</p>);;
        }

      var itemPage = this.props.location.pathname.substr(0,8) == '/works/i' ? true : false;

      var nav = (
        <ReactCSSTransitionGroup transitionName="nav" transitionAppear={true} transitionAppearTimeout={0} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          <nav className={itemPage ? 'transparent' : ''}>
            <section className='left'>
              <Link to="/">mickalene thomas</Link>
            </section>
            <section className='middle'>
              {itemPage ? null : location}
              {itemPage ? null : filters}
            </section>
            <section className='right'>

              <img className={itemPage ? 'close' : ''} onClick={itemPage ? this.props.history.goBack : toggleMenu} src={itemPage ? '../../images/close.svg' : '../../images/menu.svg'} />

            </section>
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