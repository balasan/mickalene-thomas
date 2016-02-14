import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updatePath } from 'redux-simple-router'
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
          self.props.dispatch(updatePath('/works'))
      })
    }
    else {
      window.glView.start()
       if (this.props.state.routing.path == '/') {
        window.glView.add()
      }
    }

    // if(!window.glViewCorner) {
    //   var corner = true;
    //   window.glViewCorner = new GLView(corner);
    //   window.glViewCorner.add();
    //   window.glViewCorner.start();
    //   window.glViewCorner.dom.addEventListener('click', () => {
    //     self.props.dispatch(updatePath('/'))
    //   })
    //   document.getElementsByTagName('nav')[0].appendChild(window.glViewCorner.dom)
    // }

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