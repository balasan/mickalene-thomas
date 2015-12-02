// import React, { Component, PropTypes } from 'react';

// const Works = () => {
//   return (
//     <div>works</div>
//   );
// }

// export default Works

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import * as WorkActions from '../actions/work'

// @connect(
//   state => ({counter: state.counter}),
//   dispatch => { return bindActionCreators(CounterActions, dispatch) }
// )
// export default class Counters extends Component {
//   render () {
//     return <Counter { ...this.props }/>;
//   }
// }

// ----- same as ---

// const mapStateToProps = (state) => {
//   return {counter: state.counter }
// }

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators(CounterActions, dispatch)
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps)(Counter)

// ----- same as ---

const Works = connect(
  state => {
    return {work: state.work}
  },
  dispatch => {
    return bindActionCreators(WorkActions, dispatch)
  })(Work)

export default Works