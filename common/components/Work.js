import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class Work extends Component {

  render () {

    const { work, clickitem } = this.props

    if( !work ) return null;

    var selectedWork;
    var all;

    if (work.all) {
      all = (
        <seciton className='flex-images'>
            {work.all.map(function (item, i) {
              return (
                <Link className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={i} to={'/works/i/' + item.id}>
                  <img
                    key={i}
                    onClick={clickitem.bind(i, item.id)}
                    src={item.image.small.url}
                  />
                </Link>
              )
            }, this)}
        </seciton>
      )
      console.log(flexImages)
      new flexImages({ selector: '.flex-images', rowHeight: 140 })
    }

    return (
      <div>
        {all}
      </div>
    )
  }
}

