import React, { Component, PropTypes, Link } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');
var Hammer = require('react-hammerjs');
import { updatePath } from 'redux-simple-router';

export default class SingleSlide extends Component {
  componentDidMount() {
    var self = this;
    this.imageContainer = document.getElementsByClassName('imageContainer');
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize(e){
    var image;
    if(e)
      image = e.target || e.srcElement;
    var imageContainer = image.parentNode

    imageContainer.style.height = "auto";
    if (image.clientHeight > imageContainer.clientHeight){
      imageContainer.style.height = "100%";
    }

    setTimeout(function(){
      forceRedraw(imageContainer)
    },0)
  }

  createMarkup() {
    var self = this;
    return {__html: self.props.workItem.video};
  }

  render () {
    var self = this;
    var url = null;
    var videoEl = null;
    var relatedEl = null;
    var related = null;
    var description = null;
    var workObj = self.props.state.works.obj;

    if (self.props.workItem) {
      url = self.props.workItem.url;
    }


    if (workObj) {
      if (workObj[self.props.params.itemId].related.length) {
        related = workObj[self.props.params.itemId].related;
        relatedEl = related.map(function(id) {
          var item = workObj[id];
          var relatedUrl = null;
          if (item.tags[0] == 'exhibitions') {
            relatedUrl = '/works/exhibitions/'+id;
          } else {
            relatedUrl = '/works/i/'+id;
          }
          return (<a href={relatedUrl} className="related"><img src={workObj[id].image.small.url} /></a>);
        })
      }
      if (workObj[self.props.params.itemId]) {
        var parentItem = workObj[self.props.params.itemId];
        var date = parentItem.date;
        var formattedDate = '';
        if (typeof date == 'string') {
          formattedDate = date.substr(0, 4);
        }

        var description = (
          <div className="description">
            <p>{parentItem.title}</p>
            <p>{formattedDate}{parentItem.medium ? ', ' + parentItem.medium : null}</p>
          </div>
        )
      }
    }

    const nextItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.props.nextIndex))
    }
    const prevItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.props.prevIndex))
    }

    const swipe = function(e) {
      if (e.deltaX < 0) {
        prevItem()
      } else {
        nextItem();
      }
    }

    var image = (
      <div className={related ? 'image noselect' : "exhibImage noselect"} id="singleImage">
        <div className={'no-events imageContainer'}>
          <img className={'no-events'} src={url}/>
        </div>
      </div>
    )

    return (
        <ReactCSSTransitionGroup
          transitionName="single"
          transitionAppear={true}
          transitionAppearTimeout={1000}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={450}
          >
          <div className={related ? 'slide' : 'exhibSlide'} key={url}>
            {image}
            {description}
            <div className="relatedParent">
              {relatedEl}
            </div>
            <Hammer onSwipe={swipe.bind(this)}><div className="swipe-field"></div></Hammer>
          </div>
        </ReactCSSTransitionGroup>
    );
  }
};

var forceRedraw = function(element){

    if (!element) { return; }

    var n = document.createTextNode(' ');
    var disp = element.style.display;  // don't worry about previous display style

    element.appendChild(n);
    element.style.display = 'none';

    setTimeout(function(){
        element.style.display = disp;
        n.parentNode.removeChild(n);
    },20); // you can play with this timeout to make it as short as possible
}
