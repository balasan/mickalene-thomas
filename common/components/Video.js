import React, { Component, PropTypes } from 'react'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class Video extends Component {

  componentDidMount() {

    this.video = document.getElementById(this.props.videoid);

    if(this.video.getAttribute('ready') != 'true'){
      this.initVideo();
      this.resize();
    }
    else{
      this.video.play();
      this.video.className="video";
      this.resize();
    }
  }

  componentWillUpdate(newProps){
    if(newProps.menu && this.props.videoid == "vidBg"){
      if(newProps.menu.showMenu == true){
        this.video.play();
        this.video.className="video";
        this.resize();
      }
      else{
        this.video.pause();
        this.video.className="hide video";
      }
    }
  }

  componentWillUnmount(){
    this.video.pause();
    this.video.className = "hidden video";
    window.removeEventListener('resize', this.resize.bind(this));
  }

  initVideo(){
    var self = this;
    self.video.addEventListener("loadedmetadata", function(){
        self.vidHeight = self.video.offsetHeight;
        self.vidWidth = self.video.offsetWidth;
        self.resize();
    })
    this.video.setAttribute('ready','true')
    window.addEventListener('resize', this.resize.bind(this));
    this.video.play();
    this.video.className="video";
  }

  resize() {
    var self = this;
    self.vidHeight = self.video.offsetHeight;
    self.vidWidth = self.video.offsetWidth;

    var viewportWidth  = window.innerWidth
    var viewportHeight = window.innerHeight
    //assume all videos are the same width height
    if(self.vidWidth/self.vidHeight > viewportWidth/viewportHeight){
      self.vidHeight = self.video.style.height = viewportHeight + 'px';
      self.vidWidth =  self.video.style.width = 'auto'
    }
    else{
      self.vidWidth = self.video.style.width = viewportWidth + 'px';
      self.vidHeight =  self.video.style.height = 'auto'
    }
  }

  render () {
    return null;
  }
}