import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';

export default class Menu extends Component {

  render () {
     const { toggle } = this.props
    return (
      <div>
      <nav>
        <div className='holdImg'>
        <img onClick={toggle} src='images/menu.svg'/>
        </div>
      </nav>
      <section className={this.props.togglestate ? 'hidden links' : 'links'}>
        <Link to="/home">home</Link>
        <Link to="/about">about</Link>
        <Link to="/works">works</Link>
        <Link to="/news">news</Link>
      </section>

      </div>
    )
  }
}