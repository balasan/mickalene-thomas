import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter'
import { fetchCounter } from '../api/counter';

// @connect(
//   state => ({counter: state.counter}),
//   dispatch => { return bindActionCreators(CounterActions, dispatch) }
// )
export default class Counters extends Component {

  // static propTypes = {
  //   counter:    PropTypes.number.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // }

  static fetchData(props) {
    var { loadCounter } = props
    return Promise.all([
      loadCounter()
    ])
  }

  componentDidMount() {
    if (!this.props.counter) {
      this.constructor.fetchData(this.props);
    }
  }

  render () {
    // console.log("got dem props", this.props)
    return <Counter { ...this.props }/>;
  }
}

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

// Counters.propTypes = {
//   counter:    PropTypes.number.isRequired,
//   dispatch: PropTypes.func.isRequired
// }

export default connect(
  state => {
    return {counter: state.counter}
  },
  dispatch => {
    return bindActionCreators(CounterActions, dispatch)
  })(Counters)

// export default Counters

