import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter'

@connect(
  state => ({counter: state.counter}),
  dispatch => { return bindActionCreators(CounterActions, dispatch) }
)

// const mapStateToProps = (state) => {
//   return {
//     counter: counter: state.counter,
//     dispatch: return bindActionCreators(CounterActions, dispatch)
//   }
// }

// connect(mapStateToProps, { counter })(Counters)

export default class Counters extends Component {
  render () {
    return <Counter { ...this.props }/>;
  }
}
