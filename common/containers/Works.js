import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';
import { fetchItem } from '../api/work';


if(process.env.BROWSER){
  require('./../../client/css/work.css');
}
// @connect(
//   state => ({counter: state.counter}),
//   dispatch => { return bindActionCreators(CounterActions, dispatch) }
// )
export default class Works extends Component {

  // static propTypes = {
  //   counter:    PropTypes.number.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // }

  static fetchData(dispatch) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadWork()
    ])
  }

  // static fetchItem(dispatch) {
  //   var { loadItem } = bindActionCreators(WorkActions, dispatch)
  //   return Promise.all([
  //     loadItem()
  //   ])
  // }

  // static fetchDataClient(dispatch) {
  //   var { loadWork } = bindActionCreators(WorkActions, dispatch)
  //   return Promise.all([
  //     loadWork()
  //   ])
  // }

  componentDidMount() {
    console.log(this.props)
    if (!this.props.work) {
      this.constructor.fetchData(this.props.dispatch);
    }
  }

  render () {
    // console.log("got dem props", this.props)
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
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(Works)

// export default Counters

