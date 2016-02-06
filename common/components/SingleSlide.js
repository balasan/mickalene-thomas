import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');

export default class SingleSlide extends Component {
   componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    // console.log(this.props.workItem)
    var url = this.props.workItem.image.small.url;
    var hiRes = this.props.workItem.image.medium.url;
    var title = this.props.workItem.title;
    var self = this;

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

    var image = (
        <div className="image" id="singleImage">
          <img onClick={toggleZoom} src={url}/>
        </div>
    )

    var description = (
        <div className="description">
            <p>{title}</p>
            <p>{this.props.workItem.date.substr(0, 4)}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
        </div>
    )

    var mag = (
      <div className="tiles">
        <div className="tile" onClick={toggleZoom} data-scale="2.4" data-image={hiRes}>
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
          </div>
          <img onClick={toggleZoom} src="../../images/close.svg" className="zoom-close" />
        </ReactCSSTransitionGroup>
    );
  }
};

