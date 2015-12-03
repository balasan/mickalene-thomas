import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
import { fetchMenu } from '../api/menu';

export default class Menu extends Component {
      static fetchData(dispatch) {
    var { loadMenu } = bindActionCreators(MenuActions, dispatch)
    return Promise.all([
      loadMenu()
    ])
  }

  componentDidMount() {
    if (!this.props.menu) {
      this.constructor.fetchData(this.props.dispatch);
      console.log(this.props)
    }
  }

  render () {
     const { toggle } = this.props
    return (
      <div>
      <nav>
        <div className='holdImg'>
        <img onClick={toggle} src='images/menu.svg'/>
        </div>
      </nav>
       <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        { this.props.togglestate ? <section className='links'>
        <Link to="/home">home</Link>
        <Link to="/about">about</Link>
        <Link to="/works">works</Link>
        <Link to="/news">news</Link>
        </section> : null }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default connect(
  state => {
    // console.log(state, "state.work")
    return {togglestate: state.menu}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Menu)