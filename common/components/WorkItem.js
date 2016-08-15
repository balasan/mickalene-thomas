import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';
import SingleSlide from './SingleSlide';

Number.prototype.mod = function(n) { return ((this % n) + n) % n; };

export default class WorkItem extends Component {

  componentWillUpdate(newProps) {
    var self = this;
    if(!newProps.params.itemId) return this.workItem = null;
    var newId = newProps.params.itemId;
    if (newProps.state.works.obj) {
      var workObj = newProps.state.works.obj;
      if (workObj[newId]) {
        self.workItem = workObj[newId];
      }
    }
    if (newProps.filteredWorks.length) self.getNextPrevItems(newProps);
  }


  getNextPrevItems(newProps) {
    var self = this;
    const { state, params, filteredWorks } = newProps;
    var nextIndex;
    var prevIndex;
    filteredWorks.forEach(function(item, i) {
      if (item.id == params.itemId) {
        nextIndex = i+1;
        prevIndex = i-1
      }
    })
    nextIndex = nextIndex.mod(filteredWorks.length);
    prevIndex = prevIndex.mod(filteredWorks.length);

    this.nextItem = filteredWorks[nextIndex];
    this.prevItem = filteredWorks[prevIndex];

    var imgN = new Image()
    imgN.src = this.nextItem.image.medium.url
    var imgP = new Image()
    imgP.src = this.prevItem.image.medium.url
  }

  render () {
    var self = this;

    const nextItem = function() {
      self.props.dispatch(updatePath('/works/i/' + self.nextItem.id))
    }
    const prevItem = function() {
      self.props.dispatch(updatePath('/works/i/' + self.prevItem.id))
    }
    const closeItem = function() {
      self.props.dispatch(updatePath(self.props.closeUrl))
    }

    const { state, clickitem } = this.props

    var workItem = this.workItem;

    if ( !workItem ) return false;

    var arrows = (
      <div className="arrowsParent">
        <section onClick={prevItem} className="left"></section>
        <section className="middle"></section>
        <section onClick={nextItem} className="right"></section>
      </div>
    )

    return (
      <div className='selectedWork'>
        <section className='showcase'>
          <SingleSlide workItem={workItem} {...this.props} >
          </SingleSlide>
          {arrows}
        </section>
        <img className={'closeItem noselect'} onClick={closeItem} src={'../../images/close.svg'} />
      </div>
    )
  }
}
