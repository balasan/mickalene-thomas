import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'

export default class Menu extends Component {

static fetchMenu(dispatch) {
    var { loadMenu } = bindActionCreators(MenuActions, dispatch)
    return Promise.all([
      loadMenu()
    ])
  }

  componentDidMount() {
      this.constructor.fetchMenu(this.props.dispatch);
  }

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = ''
    var filters;

    if (path == 'works/filter/:filter' || 'works/i/:itemId' || 'works') {
      location = <Link onClick={this.props.initFilter.bind(0, 'all')} to='/works'>works</Link>
    }

    const { initFilter, toggle } = this.props

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

    if (path == 'works/filter/:filter' || path == 'works/i/:itemId' || path == 'works') {
      filters = (
        <section className='filterLinks'>
        <span>
        <Link onClick={initFilter.bind(0, 'all')} className={!filterType ? 'selected' : null} to='/works'>all</Link>
        <p>/</p>
        </span>
          {uniqueTags.map(function (filter, i) {
            return (
              <span key={i}>
                <Link key={i} onClick={initFilter.bind(i, filter)} className={filterType == filter ? 'selected' : null} to={'/works/filter/' + filter}>
              {filter}
              </Link>
              {i != uniqueTags.length - 1 ? <p>/</p> : null}
              </span>
            )}, this)}
         </section>
      )
    }

    if (this.props.state.menu) {
      if (this.props.state.menu.toggle) {
        var links = <section className='links'>
        <Link onClick={toggle} to="/works">works</Link>
        <Link onClick={toggle} to="/about">about</Link>
        <Link onClick={toggle} to="/news">news</Link>
        <Link onClick={toggle} to="/store">store</Link>
        <Link onClick={toggle} to="/contact">contact</Link>
        </section>
      }
    }

    return (
      <div>
      <nav>
        <p>{location}</p>
        {filters}
        <div className='holdImg'>
        <img onClick={toggle} src='../../images/menu.svg'/>
        </div>
      </nav>
       <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {links}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default connect(
  state => {
    console.log(state, 'menu.state')
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Menu)