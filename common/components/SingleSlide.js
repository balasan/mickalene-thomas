import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class SingleSlide extends Component {
  render () {
    var url = this.props.workItem.image.medium.url;
    var title = this.props.workItem.title;

    var image = (
        <div className="image" id="singleImage">
          <img src={url}/>
        </div>
    )

    var description = (
        <div className="description">
            <p>{title}</p>
            <p>{this.props.workItem.date.substr(0, 4)}{this.props.workItem.medium ? ', ' + this.props.workItem.medium : null}</p>
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
            {description}
          </div>
        </ReactCSSTransitionGroup>
    );
  }
};

