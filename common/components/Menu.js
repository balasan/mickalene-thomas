import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MenuActions from '../actions/menu'
// import { fetchMenu } from '../api/menu';

export default class Menu extends Component {

  render () {
    var type = this.props.params.type;
    var path = this.props.children.props.route.path;
    console.log(type, 'type')
    var location = ''
    var filters;

    switch(path) {
      case 'works/i/:itemId':
        location = <Link to='/works'>works</Link>
        break;
      case 'works/type/:type':
        location = <Link to='/works'>works</Link>
        filters = <section className='filterLinks'>
        <Link to="/works" className={!type ? 'selected' : null}>all</Link>
        <Link to="/works/type/photographs" className={type == 'photographs' ? 'selected' : null}>photographs</Link>
        <Link to="/works/type/paintings" className={type == 'paintings' ? 'selected' : null}>paintings</Link>
        </section>
        break;
      case 'works':
      location = <Link to='/works'>works</Link>
        filters = <section className='filterLinks'>
        <Link to="/works" className={!type ? 'selected' : null}>all</Link>
        <Link to="/works/type/photographs" className={type == 'photographs' ? 'selected' : null}>photographs</Link>
        <Link to="/works/type/paintings" className={type == 'paintings' ? 'selected' : null}>paintings</Link>
        </section>
        break;
      default:
        location = path
        filters = null
    }

     const { toggle } = this.props
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
        { this.props.togglestate ? <section className='links'>
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
    return {togglestate: state.menu}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Menu)