import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import range from 'lodash.range';
import presets from '../presets';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import {Motion, spring, TransitionMotion, StaggeredMotion} from 'react-motion';

export default class Work extends Component {

  componentDidMount() {
    if (!this.props.work) {
      setTimeout(function() {
        new flexImages({ selector: '.flex-images', rowHeight: 250 })
      }, 500);
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

  // getStyles(prevStyles) {

  //   const endValue = prevStyles.map((_, i) => {
  //     console.log(this, 'dis')
  //     return i === 0
  //       ? this.props.work.all
  //       : {
  //           data: _,
  //           x: spring(prevStyles[i - 1].x),
  //           y: spring(prevStyles[i - 1].y),
  //         };
  //   });
  //   return endValue;

  // }


  render () {

    const { work, clickitem } = this.props

    console.log(this.props, 'now')

    if (work) {
      if (work.all) {
var transition = (
            <StaggeredMotion
              defaultStyles={range(work.all.length).map(() => ({x: 0}))}
              styles={prevStyles => prevStyles.map((_, i) => {
              return i === 0
              ? {x: spring(1, [10, 17])}
              : prevStyles[i - 1];
            })}>
                {interpolatedStyles =>
                  <div className="flex-images">
                    {interpolatedStyles.map((style, i) =>
                      <Link
                          key={i}
                          to={'/works/i/' + work.all[i].id}
                          style={{opacity: style.x}}
                          data-h={work.all[i].image.small.dimensions.height}
                          data-w={work.all[i].image.small.dimensions.width}
                          className='item'
                          >
                          <img src={work.all[i].image.small.url} />
                          </Link>
                    )}
                  </div>
                }
            </StaggeredMotion>
          )

      }
    }

    return (
      <div>
        {transition}
      </div>
    )
  }
}

