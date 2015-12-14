import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class SelectedComponent extends Component {

  componentDidMount() {
  }

  render () {

    const { work, clickitem } = this.props

    if( !work ) return null;

    var selectedWork;

    if ( work.currentitem ) {
      selectedWork = (
        <section className='showcase'>
          <div className="image">
            <img src={work.currentitem[0].image.main.url} />
          </div>
          <div className="description">
            <div>
              <p>{work.currentitem[0].title}</p>
              <p>{work.currentitem[0].date.substr(0, 4)}</p>
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

