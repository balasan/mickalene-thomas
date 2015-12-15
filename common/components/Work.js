import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class Work extends Component {

  componentDidMount() {
    if (!this.props.work) {
      setTimeout(function() {
        new flexImages({ selector: '.flex-images', rowHeight: 250 })
      }, 250);
    } else {
       new flexImages({ selector: '.flex-images', rowHeight: 250 })
    }
  }

  componentWillUpdate() {
    delete flexImages({ selector: '.flex-images', rowHeight: 250 })
  }

  componentDidUpdate() {
    new flexImages({ selector: '.flex-images', rowHeight: 250 })
  }

  render () {

    const { work, clickitem } = this.props

    if( !work ) return null;

    var all;

    if (work.all) {
      all = (
        <div className='flex-images'>
        <ReactCSSTransitionGroup transitionName="grid" transitionEnterTimeout={500} transitionLeaveTimeout={2000}>
            {work.all.map(function (item, i) {
              return (
                  <Link style={{transition: 'opacity 300ms ' + i*0.1 + 's cubic-bezier(0.175, 0.665, 0.320, 1)'}} className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={i} to={'/works/i/' + item.id}>
                    <img
                      key={i}
                      onClick={clickitem.bind(i, item.id)}
                      src={item.image.small.url}
                    />
                  </Link>
              )
            }, this)}
            </ReactCSSTransitionGroup>
        </div>
      )
    }

    return (
      <div>
        {all}
      </div>
    )
  }
}

