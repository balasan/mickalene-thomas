import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var wtf = require('magnificent');

export default class SingleSlide extends Component {
   componentDidMount() {
    window.MAGNIFICENT_OPTIONS = {
      noTrack: true
    };
  }

  render () {
    var url = this.props.workItem.image.medium.url;
    var title = this.props.workItem.title;

    console.log(wtf, 'mag');

    const fullscreen = function() {

      var elem = document.getElementsByClassName('image')[0].childNodes[0];
      var app = document.getElementById('app');
      var body = document.getElementsByTagName("body")[0];
      var mag = document.getElementsByClassName('mag')[0];

      if (body.requestFullscreen) {
        body.requestFullscreen();
      } else if (body.msRequestFullscreen) {
        body.msRequestFullscreen();
      } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
      }

      var host = document.getElementsByClassName('thumb')[0];
      console.log(host, 'host')
      host.Mag();
    }

    var image = (
        <div className="image" id="singleImage">
          <img onClick={fullscreen} src={url}/>
        </div>
    )

    var description = (
        <div className="description">
            <p>{title}</p>
            <p>{this.props.workItem.date.substr(0, 4)}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
        </div>
    )

    var mag = (
      <div className="mag">
        <div mag-thumb="inner" className="thumb">
          <img src={url} />
        </div>
        <div mag-zoom="inner" className="zoom">
          <img src={url} />
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
        </ReactCSSTransitionGroup>
    );
  }
};

