import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';

// @connect(
//   state => ({counter: state.counter}),
//   dispatch => { return bindActionCreators(CounterActions, dispatch) }
// )
export default class Works extends Component {

  // static propTypes = {
  //   counter:    PropTypes.number.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // }

  static fetchData(props) {
    var { loadWork } = props
    return Promise.all([
      loadWork()
    ])
  }

  componentDidMount() {
    if (!this.props.work) {
      this.constructor.fetchData(this.props);
    }
  }

  render () {
    console.log("got dem props", this.props)
    return <Work { ...this.props }/>;
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
    console.log(state, "state.work")
    return {work: state.work}
  },
  dispatch => {
    return bindActionCreators(WorkActions, dispatch)
  })(Works)

// export default Counters

