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
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
      if (!this.props.work.flex){
        new flexImages({ selector: '.flex-images', rowHeight: 250 })
           console.log(this.props.work.flex, 'flex?')
           this.props.setFlex(true);
      } else {
        console.log(this.props.work.flex, 'flex?')
        setTimeout(function() {
          new flexImages({ selector: '.flex-images', rowHeight: 250 })

        }, 500);
      }
  }

  render () {
    console.log(this.props, 'work props')
    const { work, clickitem } = this.props

    console.log(work, 'work now')

    if (work) {
        var all = (
        <div>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
           {work.all.map(function (item, i) {
              return (
                  <Link className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={item.id} to={'/works/i/' + item.id}>
                    <img
                      key={item.id}
                      src={item.image.small.url}
                    />
                  </Link>
              )
            }, this)}
          </ReactCSSTransitionGroup>
        </div>)

    }

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

