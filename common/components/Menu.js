import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'

export default class Menu extends Component {

static fetchMenu(dispatch, length) {
    var { loadMenu } = bindActionCreators(MenuActions, dispatch, length)

    return Promise.all([
      loadMenu(length)
    ])
  }

  componentDidMount() {
      this.constructor.fetchMenu(this.props.dispatch, this.props.location.pathname.length);
  }

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = ''
    var filters;

    const { toggle, toggleLinks, toggleNav, hideX, showAllX} = this.props

    var tags = [];

    if (this.props.state.work) {
      this.props.state.work.store.forEach(function(one) {
        one.tags.forEach(function(tag) {
          tags.push(tag);
        })
      })
    }

    var uniqueTags = [];

    tags.forEach(function(tag) {
      if(uniqueTags.indexOf(tag) < 0) {
        uniqueTags.push(tag)
      }
    })

    if (path == 'works/filter/:filter' || path == 'works') {
      filters = (
        <section className='filterLinks'>
        <Link onClick={this.props.showAllX} className={!filterType ? 'selected' : null} to='/works'>all</Link>
          {uniqueTags.map(function (filter, i) {
            return (
                <Link key={i} onClick={this.props.showFilteredX} className={filterType == filter ? 'selected' : null} to={'/works/filter/' + filter}>
              {filter}
              </Link>
            )}, this)}
         </section>
      )
    }

    if (path == 'works/i/:itemId' && this.props.state.work) {
      if (this.props.state.work.currentitem) {
              var tag = this.props.state.work.currentitem[0].tags[0];
      filters = (
        <section className='filterLinks'>
         <Link onClick={this.props.showFilteredX} to={'/works/filter/' + tag}>{'back to ' + tag}</Link>
        </section>
        )
      }

    }

    if (this.props.state.menu) {
      if (this.props.state.menu.toggleLinks) {
        var links = <section className='links'>
        <Link onClick={showAllX} to="/works">works</Link>
        <Link to="/about">about</Link>
        <Link to="/news">news</Link>
        <Link to="/store">store</Link>
        <Link to="/contact">contact</Link>
        </section>
      }

      if (this.props.state.menu.toggleNav) {
        if (this.props.location.pathname.substr(0,8) == '/works/i' || this.props.location.pathname.substr(0,13) == '/works/filter') {
          location = <Link onClick={this.props.showAllX} to='/works'>works</Link>;
        } else {
          location = path;
      }

        var nav = (<nav>
        <section className='left'>
        <Link to="/">mickalene thomas</Link>
        </section>
        <section className='middle'>
          <p>{location}</p>
          {filters}
          </section>
          <section className='right'>
            <img onClick={toggleLinks} src='../../images/menu.svg'/>
          </section>
        </nav> )
      }
    }

    return (
      <div>
       <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {nav}
        {links}
        </ReactCSSTransitionGroup>
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