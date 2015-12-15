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

    const { toggle, toggleLinks } = this.props

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
        <Link className={!filterType ? 'selected' : null} to='/works'>all</Link>
          {uniqueTags.map(function (filter, i) {
            return (
                <Link key={i} className={filterType == filter ? 'selected' : null} to={'/works/filter/' + filter}>
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
         <Link to={'/works/filter/' + tag}>{'back to ' + tag}</Link>
        </section>
        )
      }

    }

    if (this.props.state.menu) {
      if (this.props.state.menu.toggleLinks) {
        var links = <section className='links'>
        <Link onClick={toggleLinks} to="/works">works</Link>
        <Link onClick={toggleLinks} to="/about">about</Link>
        <Link onClick={toggleLinks} to="/news">news</Link>
        <Link onClick={toggleLinks} to="/store">store</Link>
        <Link onClick={toggleLinks} to="/contact">contact</Link>
        </section>
      }

      if (this.props.state.menu.toggleNav) {
        console.log(this.props.location.pathname, "pathname")
        if (this.props.location.pathname.substr(0,8) == '/works/i' || this.props.location.pathname.substr(0,13) == '/works/filter') {
          location = <Link to='/works'>works</Link>;
        } else {
          location = path;
        }

        var nav = <nav>
          <p>{location}</p>
          {filters}
          <div className='holdImg'>
            <img onClick={toggleLinks} src='../../images/menu.svg'/>
          </div>
        </nav>
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
    // console.log(state, 'menu.state')
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Menu)