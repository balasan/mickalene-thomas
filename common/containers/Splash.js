import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { updatePath } from 'redux-simple-router'

// const Home = () => {
//   return (
//     <div></div>
//   )
// }

// export default Home



class Splash extends Component {

  static glView;
  componentDidMount() {
    var GLView = require('../../client/glView')
    if(!window.glView)
      window.glView = new GLView()
    window.glView.start()
    window.glView.dom.addEventListener('click', () => {
      this.props.dispatch(updatePath('/works'))
    })
  }

  componentWillUnmount() {
    window.glView.stop()
  }

  render () {
    // console.log("got dem props", this.props)
    return (
      <div></div>
    )
  }
}

export default connect(
  state => {
    return {work: state.work}
  },
  dispatch => {
    return {dispatch}
  })(Splash)