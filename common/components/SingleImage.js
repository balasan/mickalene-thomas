import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class SingleItem extends Component {
  render () {
    return (
        <ReactCSSTransitionGroup
          transitionName="single"
          transitionAppear={true}
          transitionEnterTimeout={750}
          transitionLeaveTimeout={450}>
          <img src={this.props.imageSrc} key={this.props.imageSrc} />
        </ReactCSSTransitionGroup>
    );
  }
};

SingleItem.propTypes = {
    imageSrc: React.PropTypes.string.isRequired
}
