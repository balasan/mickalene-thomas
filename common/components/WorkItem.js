import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class WorkItem extends Component {
  componentDidMount() {
    var workItemNew = null;
    if (this.props.state.workItem) {
      workItemNew = this.props.state.workItem;
    } else {
      var idX = this.props.params.itemId;
      this.props.state.works.forEach(function(item, i) {
        if (item.id == idX) {
          workItemNew = item;
        }
      })
    }
    this.workItem = workItemNew;
    this.render();
  }

  render () {

    const { state, clickitem } = this.props

    var selectedWork;
    var workItem = this.workItem;
    if ( workItem ) {
      selectedWork = (

        <section className='showcase'>
            <ReactCSSTransitionGroup
              transitionName="single"
              transitionAppear={true}
              transitionAppearTimeout={0}
              transitionEnterTimeout={0}
              transitionLeaveTimeout={0}>
              <div className="image">
           <img src={workItem.image.main.url} />
              </div>
           </ReactCSSTransitionGroup>
          <div className="description">
            <div>
            <p>{workItem.title}</p>
              <p>{workItem.date.substr(0, 4)}{workItem.medium ? ', ' + workItem.medium : null}</p>
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

