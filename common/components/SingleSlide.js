import React, { Component, PropTypes, Link } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');
var Hammer = require('react-hammerjs');
import { push } from 'react-router-redux';

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

    if (imageContainer) {
      imageContainer.style.height = "auto";
      if (image.clientHeight > imageContainer.clientHeight){
        imageContainer.style.height = "100%";
      }

      setTimeout(function(){
        forceRedraw(imageContainer)
      },0)
    }
  }

  createMarkup() {
    var self = this;
    return {__html: self.props.workItem.video};
  }

  render () {
    var self = this;
    var imgUrl = this.props.image.main.url || this.props.workItem.image.main.url;
    var title = this.props.workItem.title;
    var videoEl = null;
    var relatedEl = null;
    var external = null;
    var related = null;
    var workObj = self.props.state.works.obj;

    if (self.props.workItem.related) {
      related = self.props.workItem.related;
      var relatedUrl = '/works/exhibitions/'+related;
      if (!self.props.params.exhibitionId) relatedEl = (<div className="related"><a href={relatedUrl}>Go to exhibition</a></div>);
    }

    if (self.props.workItem.video) {
      videoEl = (<div className="vimeoFrame" dangerouslySetInnerHTML={self.createMarkup()} />);
    }

    const nextItem = function() {
      self.props.props.dispatch(push('/works/i/' + self.props.nextItem.id))
    }
    const prevItem = function() {
      self.props.props.dispatch(push('/works/i/' + self.props.prevItem.id))
    }

    const swipe = function(e) {
      if (e.deltaX < 0) {
        this.props.prevItem() || prevItem()
      } else {
        this.props.nextItem() || nextItem();
      }
    }

    var tag = this.props.workItem.tags[0];

    var image = (
        <div className="image noselect" id="singleImage">
          <div className={tag == 'paintings' ? 'no-events painting  imageContainer' : 'no-events imageContainer'}>
            <img className={tag == 'paintings' ? 'no-events painting' : 'no-events'} src={imgUrl}/>
          </div>
        </div>
    )

    var date = this.props.workItem.date;
    var formattedDate = '';
    if (typeof date == 'string') formattedDate = date.substr(0, 4);

    var description = (
      <div className="description">
          <p>{title}</p>
          <p>{formattedDate}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
      </div>
    )

    if (this.props.workItem.external) {
      description = (
        <div className="description">
            <p>{title}</p>
            <p>{formattedDate}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
            <a href={this.props.workItem.external} className="external" target="_blank">Click for more info</a>
        </div>
      )
    }

    var mag = (
      <div className="tiles">
        <div className="tile" data-scale="2.4" data-image={imgUrl}>
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
          <div className="slide" key={imgUrl}>
            {!self.props.workItem.video ? image : null}
            {videoEl}
            {mag}
            {description}
            {external}
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
