import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

if (process.env.BROWSER) {
    require('./../../client/css/loader.css');
}

class Loader extends Component {

  render() {

    if (!this.props.state.menu.showLoader) return null;

    return (
      <ReactCSSTransitionGroup transitionName="loader"
            transitionAppear = {true}
            transitionAppearTimeout = {500}
            transitionEnterTimeout = {500}
            transitionLeaveTimeout = {500}>
{/*          <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>  */}
        <div className="loader">
          <div className="flipper">
            <div className="front-loader"></div>
            <div className="back-loader"></div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

export default Loader;