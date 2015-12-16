import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import {Motion, spring, StaggeredMotion} from 'react-motion';

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

    if (work) {
      console.log(work.all, 'work all now')
      var all = (
        <StaggeredMotion defaultStyles={work.all}
          styles={prevStyles => prevStyles.map((_, i) => {
          return i === 0
          ? {x: spring(this.state.mouseX)} // first item follows mouse's x position
          : prevStyles[i - 1]; // item i follow the position of the item before it, creating a natural staggering spring
        })}>
        {interpolatedStyles =>
          <div>
            {interpolatedStyles.map((item, i) =>
              <Link className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={item.id} to={'/works/i/' + item.id}>
                  <img
                    key={item.id + 1}
                    onClick={clickitem.bind(i, item.id)}
                    src={item.image.small.url}
                  />
                </Link>
              )}
            </div>
          }
        </StaggeredMotion>
        )
    }

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

