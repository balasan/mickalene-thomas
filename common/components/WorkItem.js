import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import ReactTransitionGroup from 'react-addons-transition-group';

export default class WorkItem extends Component {
  componentDidMount() {
    this.render();
  }

  render () {

    const { workItem, clickitem } = this.props

    var selectedWork;

    if ( workItem ) {
      selectedWork = (

        <section className='showcase'>
            <ReactCSSTransitionGroup
              transitionName="single"
              transitionAppear={false}
              transitionAppearTimeout={0}
              transitionEnterTimeout={0}
              transitionLeaveTimeout={400}>
              <div className="image">
                  <img src={workItem.image.main.url} />
              </div>
           </ReactCSSTransitionGroup>
          <div className="description">
            <div>
              <p>{workItem.title}</p>
              <p>{workItem.date.substr(0, 4)}</p>
            </div>
          </div>
        </section>
      )
    }


    return (
      <div className='selectedWork'>
        {selectedWork}
      </div>
    )
  }
}

