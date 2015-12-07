import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
import * as WorkActions from '../actions/work'

export default class Menu extends Component {

  static fetchData(dispatch) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadWork()
    ])
  }

  componentDidMount() {
    if (!this.props.work) {
      this.constructor.fetchData(this.props.dispatch);
    }
  }

  render () {
    var filterType = this.props.params.filter;
    var path = this.props.children.props.route.path;
    var location = ''
    var filters;

    switch(path) {
      case 'works/filter/:filter':
        location = <Link to='/works'>works</Link>
        break;
      case 'works/i/:itemId':
      location = <Link to='/works'>works</Link>
        break;
      case 'works':
      location = <Link to='/works'>works</Link>
        break;
      default:
        location = path
    }

    const { toggle, work } = this.props

    var tags = [];
    if (this.props.state.work) {
      this.props.state.work.all.forEach(function(one) {
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

    if (uniqueTags) {
      filters = (
        <div>
        <Link className={!filterType ? 'selected' : null} to='/works'>all</Link>
          {uniqueTags.map(function (filter, i) {
            return (
              <Link key={i} className={filterType == filter ? 'selected' : null} to={'/works/filter/' + filter}>
              {filter}
              </Link>
            )}, this)}
        </div>
      )
    }

    return (
      <div>
      <nav>
        <p>{location}</p>
        <section className='filterLinks'>
      {filters}
      </section>
        <div className='holdImg'>
        <img onClick={toggle} src='../../images/menu.svg'/>
        </div>
      </nav>
       <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        { this.props.state.menu ? <section className='links'>
        <Link onClick={toggle} to="/works">works</Link>
        <Link onClick={toggle} to="/about">about</Link>
        <Link onClick={toggle} to="/news">news</Link>
        <Link onClick={toggle} to="/store">store</Link>
        <Link onClick={toggle} to="/contact">contact</Link>
        </section> : null }
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