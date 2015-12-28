import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updatePath } from 'redux-simple-router'
import * as MenuActions from '../actions/menu'
import { bindActionCreators } from 'redux'

class Splash extends Component {

  static glView;

  componentDidMount() {
    var GLView = require('../../client/glView')
    if (!window.glView) {
      window.glView = new GLView()
      window.glView.start();

      if (this.props.state.routing.path != '/') {
        setTimeout(function() {
          window.glView.stop()
        }, 500);

      }

      window.glView.dom.addEventListener('click', () => {
        window.glView.remove();
        this.props.dispatch(updatePath('/works'))
        this.props.showAllX()
      })
    }
    else {
      window.glView.start()
       if (this.props.state.routing.path == '/') {
        window.glView.add()
      }
    }
  }

  componentWillUnmount() {
    window.glView.stop()
  }

  render () {
    return (
      <div></div>
    )
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Splash)