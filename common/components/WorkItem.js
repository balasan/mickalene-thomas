import React, { Component, PropTypes } from 'react'
import { Link, Router } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { push, goBack } from 'react-router-redux';
import SingleSlide from './SingleSlide';


Number.prototype.mod = function(n) { return ((this % n) + n) % n; };

export default class WorkItem extends Component {
  componentWillMount() {
    var self = this;
    document.body.classList.add("noScroll");
    this.componentWillUpdate(this.props)
  }

  componentWillUnmount() {
    document.body.classList.remove("noScroll");
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
    let imgId = this.props.imgId ? parseInt(this.props.imgId) : undefined;
    let nextId = '';
    let prevId = '';

    if(!this.workItem) return null;

    if (imgId !== undefined) {
      nextId = '/' + ((imgId + 1) % this.workItem.additional_images.length);
      prevId = '/' + ((imgId - 1) % this.workItem.additional_images.length);
      if (imgId === 0) prevId = '/' + (this.workItem.additional_images.length - 1);
      self.nextItem = this.workItem;
      self.prevItem = this.workItem;
    }

    if (self.props.params.exhibitionId) {
      preUrl = '/works/exhibitions/' + self.props.params.exhibitionId + '/';
    } else {
      preUrl = '/works/' + this.props.params.filter + '/';
    }

    const nextItem = function() {
      self.props.dispatch(push(preUrl + self.nextItem.id + nextId))
    }
    const prevItem = function() {
      self.props.dispatch(push(preUrl + self.prevItem.id + prevId))
    }
    const closeItem = function() {
      // if( self.props.location.action === 'PUSH')
        // self.props.dispatch(goBack())
      // else {
        self.props.dispatch(push(self.props.closeUrl))
      // }
    }

    const { state, clickitem } = this.props

    var workItem = this.workItem;
    var image = self.workItem.image;
    if (self.props.imgId) image = self.workItem.additional_images[self.props.imgId];


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
          <SingleSlide
            image={image}
            prevItem={() => prevItem()}
            nextItem={() => nextItem()}
            workItem={workItem}
            {...this.props} />
          {arrows}
        </section>
        <img className={'closeItem noselect'} onClick={closeItem} src={'/images/close.svg'} />
      </div>
    )
  }
}
