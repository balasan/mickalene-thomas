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
  componentDidMount() {
    var self = this;
  }

  componentWillUpdate(nextProps, nextState) {
    var self = this;
    if (!nextProps.params.exhibitionId) {
      if (!nextProps.params.itemId) return this.workItem = null;
      var newId = nextProps.params.itemId;
      if (nextProps.state.works.obj) {
        var workObj = nextProps.state.works.obj;
        if (workObj[newId]) {
          self.workItem = workObj[newId];
        }
      }
    } else {
      if (!nextProps.params.exhibitionItemId) return this.workItem = null;
      var newId = nextProps.params.exhibitionItemId;
      if (nextProps.state.works.exhibition.obj) {
        var workObj = nextProps.state.works.exhibition.obj;
        if (workObj[newId]) {
          self.workItem = workObj[newId];
        }
      }
    }
    if (nextProps.filteredWorks.length) self.getNextPrevItems(nextProps);
  }


  getNextPrevItems(nextProps) {
    var self = this;
    const { state, params, filteredWorks } = nextProps;
    var nextIndex;
    var prevIndex;
    filteredWorks.forEach(function(item, i) {
      if (item.id == params.itemId || item.id == params.exhibitionItemId) {
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
    var preUrl = null;

    if (self.props.params.exhibitionId) {
      preUrl = '/works/exhibitions/' + self.props.params.exhibitionId + '/';
    } else {
      preUrl = '/works/i/';
    }

    const nextItem = function() {
      self.props.dispatch(updatePath(preUrl + self.nextItem.id))
    }
    const prevItem = function() {
      self.props.dispatch(updatePath(preUrl + self.prevItem.id))
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
        <img className={'closeItem noselect'} onClick={closeItem} src={'/images/close.svg'} />
      </div>
    )
  }
}
