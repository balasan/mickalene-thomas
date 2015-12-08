import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class Work extends Component {

  render () {
    const { work, clickitem } = this.props

    if( !work ) return null;

    var selectedWork;
    var all;

    if (work.all) {
      all = (
        <seciton className='workGrid'>
            {work.all.map(function (item, i) {
              return (
                <Link key={i} to={'/works/i/' + item.id}>
                  <img
                    key={i}
                    onClick={clickitem.bind(i, item.id)}
                    src={item.image.small}
                  />
                </Link>
              )
            }, this)}
        </seciton>
      )
    }

    return (
      <div>
        {all}
      </div>
    )
  }
}

