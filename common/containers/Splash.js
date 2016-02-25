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
      // if(this.props.state.routing.path == '/' || this.props.state.routing.path == '/#alt'){
        window.glView.start();
        window.glView.add();
      // }

      window.glView.dom.addEventListener('click', () => {
        window.glView.remove();
          self.props.dispatch(updatePath('/works'))
      })
    }
    else {
      window.glView.start()
       // if (this.props.state.routing.path == '/' || this.props.state.routing.path == '/#alt') {
        window.glView.add()
      // }
    }

    this.bgVid = "vidBg"
    if(window && window.location.hash == '#alt'){
      this.bgVid = 'vidPattern'
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
    var bgVid = this.bgVid ? this.bgVid : "vidBg"
    return (
      <div>
        <Video videoid={bgVid} key={bgVid}></Video>
        <Video videoid="vidPattern"></Video>
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
