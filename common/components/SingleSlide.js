import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');
var Hammer = require('react-hammerjs');
import { updatePath } from 'redux-simple-router';

export default class SingleSlide extends Component {
   componentDidMount() {
  }

  componentDidUpdate() {
  }



  render () {
    var url = this.props.workItem.image.small.url;
    var hiRes = this.props.workItem.image.medium.url;
    var title = this.props.workItem.title;
    var self = this;

    const nextItem = function() {
      self.props.props.dispatch(updatePath('/works/i/' + self.props.nextItem.id))
    }
    const prevItem = function() {
      self.props.props.dispatch(updatePath('/works/i/' + self.props.prevItem.id))
    }

    const swipe = function(e) {
      if (e.deltaX < 0) {
        prevItem()
      } else {
        nextItem();
      }
    }

    const toggleZoom = function() {

      var elem = document.getElementsByClassName('image')[0].childNodes[0];
      var app = document.getElementById('app');
      var body = document.getElementsByTagName("body")[0];
      var mag = document.getElementsByClassName('mag');

      if (body.classList.contains('zoom'))
        body.classList.remove('zoom');
      else
        body.classList.add('zoom');

      $('.tile')
        .on('mouseover', function(){
          $(this).children('.photo').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
        })
        .on('mouseout', function(){
          $(this).children('.photo').css({'transform': 'scale(1)'});
        })
        .on('mousemove', function(e){
          $(this).children('.photo').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
        })
        .each(function(){
          $(this)
            .append('<div class="photo"></div>')
            .children('.photo').css({'background-image': 'url('+ $(this).attr('data-image') +')'});
        })
    }

    var tag = this.props.workItem.tags[0];

    var image = (
        <div className="image noselect" id="singleImage">
          <img className={tag == 'paintings' ? 'no-events painting' : 'no-events'} src={url}/>
        </div>
    )
    console.log(this.props.workItem);
    var date = this.props.workItem.date;
    var formattedDate = '';
    if (typeof date == 'string') {
      formattedDate = date.substr(0, 4);
    }

    var description = (
        <div className="description">
            <p>{title}</p>
            <p>{formattedDate}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
        </div>
    )

    var mag = (
      <div className="tiles">
        <div className="tile" data-scale="2.4" data-image={hiRes}>
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
          <div className="slide" key={url}>
            {image}
            {mag}
            {description}
            <Hammer onSwipe={swipe.bind(this)}><div className="swipe-field"></div></Hammer>
          </div>
          <img onClick={toggleZoom} src="../../images/close.svg" className="zoom-close noselect" />
        </ReactCSSTransitionGroup>
    );
  }
};
