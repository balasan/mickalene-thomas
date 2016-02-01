import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';

export default class WorkItem extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
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
  }

  render () {

    var self = this;


    const nextItem = function() {
      self.workItem = null;
      var element  = document.getElementById("singleImage");
      var currentId = self.props.params.itemId;
      element.className = "image single-leave";
      setTimeout(function() {
        element.className = "image single-leave single-leave-active";
      }, 10);
      var works = self.props.state.works
      var nextIndex;
      works.forEach(function(item, i) {
        if (item.id == currentId) {
          nextIndex = i+1;
        }
      })
      var calcIndex;
      if (nextIndex < 0) {
        calcIndex = works.length += nextIndex;
      } else {
        calcIndex = nextIndex%works.length;
      }
      console.log(calcIndex, 'calcIndex')
      var newId = works[calcIndex].id;
      self.workItem = works[calcIndex];
      // self.render();
      element.className = "image single-enter";
      setTimeout(function() {
        element.className = "image single-enter single-enter-active";
      }, 10);
      self.props.dispatch(updatePath('/works/i/' + newId))
    }

    const prevItem = function() {
      self.workItem = null;
      var element  = document.getElementById("singleImage");
      element.className = "image single-leave";
      element.className = "image single-leave single-leave-active";
      var currentId = self.props.params.itemId;
      var works = self.props.state.works
      var prevIndex;
      works.forEach(function(item, i) {
        if (item.id == currentId) {
          prevIndex = i-1;
        }
      })
      var calcIndex;
      if (prevIndex < 0) {
        calcIndex = (works.length - Math.abs(prevIndex))%works.length;
      } else {
        calcIndex = prevIndex%works.length;
      }
      var newId = works[calcIndex].id;
      self.props.dispatch(updatePath('/works/i/' + newId))
      self.workItem = works[calcIndex];
      // self.render();
      element.className = "image single-enter";
      setTimeout(function() {
        element.className = "image single-enter single-enter-active";
      }, 10);
    }

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
              <div className="image" id="singleImage">
           <img src={workItem.image.main.url} key={workItem.image.main.url} />
              </div>
           </ReactCSSTransitionGroup>
          <div className="description">
            <div>
            <p>{workItem.title}</p>
              <p>{workItem.date.substr(0, 4)}{workItem.medium ? ', ' + workItem.medium : null}</p>
            </div>
          </div>
          <div className="arrowsParent">
            <section onClick={prevItem} className="left"></section>
            <section className="middle"></section>
            <section onClick={nextItem} className="right"></section>
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

