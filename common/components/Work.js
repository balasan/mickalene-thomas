import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
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

  getStyles(prevStyles) {

    const endValue = prevStyles.map((_, i) => {
      console.log(this, 'dis')
      return i === 0
        ? this.props.work.all
        : {
            data: _,
            x: spring(prevStyles[i - 1].x),
            y: spring(prevStyles[i - 1].y),
          };
    });
    return endValue;

  }


  render () {

    const { work, clickitem } = this.props

    console.log(this.props, 'now')

    if (work) {
      if (work.all) {
          var transition = (
                <StaggeredMotion
                  defaultStyles={work.all.map((one, i) => ({x: spring(1), y: 0, data: one}))}
                  styles={this.getStyles(work.all)}>
                  {items =>
                    <div className='flex-images'>
                      {items.map(({x, y, data}, i) =>
                        <Link
                          key={i}
                          to={'/works/i/' + data.id}
                          style={{opacity: x}}
                          data-h={data.image.small.dimensions.height}
                          data-w={data.image.small.dimensions.width}
                          className='item'
                          >
                          <img src={data.image.small.url} />
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

