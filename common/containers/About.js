import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { fetchAbout } from '../api/about';

export default class About extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      aboutData: null,
      hideVideo: true,
      muted: true,
    }
  }

  componentDidMount() {
    var self = this;
    fetchAbout(function(i, data) {
      self.setState({aboutData: data})
    });
  }

  toggleVideo() {
    var self = this;
    var newState = self.state.hideVideo = !self.state.hideVideo;
    self.setState({hideVideo: newState});
    var vid = self.refs.video;
    vid.play();
  }

  playToggle() {
    var self = this;
    var vid = self.refs.video;
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  }

  toggleMute() {
    var self = this;
    var vid = self.refs.video;
    if (vid.muted) {
      vid.muted = false;
      self.setState({muted: false})
    } else {
      vid.muted = true;
      self.setState({muted: true})
    }
  }

  render () {
      var self = this;
      var data = self.state.aboutData;
      var imageEl = null;
      var header = null;
      var textEl = null;
      var headerEl = null;
      var videoUrl = null;
      var videoEl = null;

      if (data) {
        if (data.header) {
          headerEl = (<h1 id="about-header">{data.header}</h1>)
        }
        if (data.body && !this.textEl) {
          textEl = [];
          data.body.forEach(function(text, i){
              textEl.push(<p key={i}>{text}</p>);
          })
        }
        if (data.image) {
          imageEl = (<section onClick={self.toggleVideo.bind(self)} className={self.state.hideVideo ? 'aboutImg' : 'aboutImg hideImg'}>
            <img src='/images/play.png' />
          </section>);
        }
      }

      videoUrl = '/video/about.mp4';
      videoEl = (<div><video onClick={self.playToggle.bind(self)} ref="video" className="aboutVideo" muted autoPlay loop><source src={videoUrl} type="video/mp4" /></video><div className={self.state.muted ? "muteToggle muted" : "muteToggle unmuted"} onClick={self.toggleMute.bind(self)}></div></div>)

      return (
        <div>
        <section className='aboutTxt'>
          {headerEl}
          <div className="mediaEls">
            {videoUrl ? videoEl : null}
            {imageEl}
          </div>
          <div id="about-body">
            {textEl}
          </div>
        </section>
        </div>
    );
  }
}