import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { fetchAbout } from '../api/about';

export default class About extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      aboutData: null,
      hideVideo: true,
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
    var vid = self.refs.okay;
    vid.play();
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
      videoEl = (<video ref="okay" className="aboutVideo" muted autoPlay loop><source src={videoUrl} type="video/mp4" /></video>)

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