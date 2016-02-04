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

    if(!newProps.params.itemId) return this.workItem = null;
    var workItemNew = null;

    if (newProps.state.workItem) {
      workItemNew = newProps.state.workItem;
    } else {
      var idX = newProps.params.itemId;
      newProps.state.works.forEach(function(item, i) {
        if (item.id == idX) {
          workItemNew = item;
        }
      })
    }
    this.workItem = workItemNew;
    if(this.props.state.works.length) this.getNextPrevItems(newProps);
  }

  getNextPrevItems(newProps) {
    const { state, params } = newProps;
    var nextIndex;
    var prevIndex;
    var works = state.works;
    works.forEach(function(item, i) {
      if (item.id == params.itemId) {
        nextIndex = i+1;
        prevIndex = i-1
      }
    })
    nextIndex = nextIndex.mod(works.length);
    prevIndex = prevIndex.mod(works.length);

    this.nextItem = works[nextIndex];
    this.prevItem = works[prevIndex];

    //preload image
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
          <SingleSlide workItem={workItem}>
          </SingleSlide>
          {arrows}
        </section>
      </div>
    )
  }
}

