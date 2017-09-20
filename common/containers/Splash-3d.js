import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import * as MenuActions from '../actions/menu'
import { bindActionCreators } from 'redux'
import Video from './../components/Video'

class Splash extends Component {

  static glView;

  componentDidMount() {

    var self = this;
    var GLView = require('../../client/glView')
    if (!window.glView) {
      window.glView = new GLView()
      if(this.props.state.routing.path == '/'){
        window.glView.start();
        window.glView.add();
      }

      window.glView.dom.addEventListener('click', () => {
        window.glView.remove();
        self.props.dispatch(push('/works'))
      })
    }
    else {
      window.glView.start()
       if (this.props.state.routing.path == '/') {
        window.glView.add()
      }
    }
  }

  componentWillUpdate(nextProps){
  }

  componentWillUnmount() {
    window.glView.remove();
    window.glView.stop()
  }

  render () {
    return (
      <div>
        <Video></Video>
      </div>
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