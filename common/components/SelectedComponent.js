import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import ReactTransitionGroup from 'react-addons-transition-group';

export default class SelectedComponent extends Component {
  componentDidMount() {
  }

  render () {
    const { work, clickitem } = this.props

    if( !work ) return null;

    var selectedWork;

    if ( work.currentitem ) {
      if (work.currentitem[0]) {
              selectedWork = (
        <section className='showcase'>
            <ReactCSSTransitionGroup
              transitionName="single"
              transitionAppear={true}
              transitionAppearTimeout={0}
              transitionEnterTimeout={0}
              transitionLeaveTimeout={400}>
              <div className="image">
                  <img src={work.currentitem[0].image.main.url} />
              </div>
           </ReactCSSTransitionGroup>
          <div className="description">
            <div>
              <p>{work.currentitem[0].title}</p>
              <p>{work.currentitem[0].date.substr(0, 4)}{work.currentitem[0].medium ? ', ' + work.currentitem[0].medium : null}</p>
            </div>
          </div>
        </section>
      )
      }
    }

    return (
      <div className='selectedWork'>
            {selectedWork}
        </div>
    )
  }
}

