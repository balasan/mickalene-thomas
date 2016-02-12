import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { fetchAbout } from '../api/about';

export default class About extends Component {
    componentDidMount() {
    var self = this;
    fetchAbout(function(i, data) {
      self.aboutData = data;
      self.render();
    });
    this.textEl = false;
  }

  componentDidUpdate() {
    var self = this;
    fetchAbout(function(i, data) {
      self.aboutData = data;
      self.render();
    });
  }

    render () {
      var self = this;
      var data = this.aboutData;
      if (data) {
        if (data.header) {
          var headerEl = document.getElementById('about-header');
          headerEl.innerHTML = data.header;
        }
        if (data.body && !this.textEl) {
          var textParent = document.getElementById('about-body');
          data.body.forEach(function(text, i){
              self.textEl = document.createElement("p");
              self.textEl.innerHTML = text;
              textParent.appendChild(self.textEl);
          })
        }
      }

      return (
        <div>
        <section className='aboutImg noselect'>
          <img src='/images/down_arrow.png' />
        </section>
        <section className='aboutTxt'>
        <h1 id="about-header"></h1>
        <div id="about-body">
        </div>
        </section>
        </div>
    );
  }
}