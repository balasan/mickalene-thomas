import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updatePath } from 'redux-simple-router'
import * as MenuActions from '../actions/menu'
import { bindActionCreators } from 'redux'

class Splash extends Component {

  static glView;

  componentDidMount() {

    var GLView = require('../../client/glView')
    if(!window.glView)
      console.log("glview mount")
      window.glView = new GLView()
      window.glView.start()
          window.glView.add()
    window.glView.dom.addEventListener('click', () => {
      window.glView.remove();
      this.props.dispatch(updatePath('/works'))
      this.props.showAllX()
      console.log(this.props, 'click this props')
    })
  }

  componentWillUnmount() {
    window.glView.stop()
  }

  render () {
    // const { toggle } = this.props
    // console.log("splash page props", this.props)
    return (
      <div></div>
    )
  }
}

// export default connect(
//   state => {
//     console.log(state)
//     return {state: state}
//   },
//   dispatch => {
//     return {dispatch}
//   })(Splash)

export default connect(
  state => {
    console.log(state, 'splash.state')
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(Splash)