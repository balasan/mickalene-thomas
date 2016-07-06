import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { fetchAbout } from '../api/about';

export default class About extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      aboutData: null,
    }
  }

  componentDidMount() {
    var self = this;
    fetchAbout(function(i, data) {
      self.setState({aboutData: data})
    });
  }

  render () {
      var self = this;
      var data = self.state.aboutData;
      var imageEl = null;
      var header = null;
      var textEl = null;
      var headerEl = null;

      if (data) {
        if (data.header) {
          headerEl = (<h1 id="about-header">{data.header}</h1>)
        }
        if (data.body && !this.textEl) {
          textEl = [];
          data.body.forEach(function(text, i){
              textEl.push(<p>{text}</p>);
          })
        }
        if (data.image) {
          imageEl = (<section style={{backgroundImage: 'url(' + data.image + ')'}} className='aboutImg noselect'>
            <img src='/images/down_arrow.png' />
          </section>);
        }
      }

      return (
        <div>
        {imageEl}
        <section className='aboutTxt'>
          {headerEl}
          <div id="about-body">
            {textEl}
          </div>
        </section>
        </div>
    );
  }
}