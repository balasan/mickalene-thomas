import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import * as WorkActions from '../actions/work'

if(process.env.BROWSER){
  require('./../../client/css/work.css');
}

export default class Works extends Component {

  static fetchDataOnClient(dispatch, filter) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }

  static clearItemOnClient(dispatch) {
    var { clearItem } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      clearItem()
    ])
  }

  componentDidMount() {
    if (!this.props.works.length) {
      this.constructor.fetchDataOnClient(this.props.dispatch, this.props.params.filter);
    }
  }

  componentWillUnmount() {
    this.constructor.clearItemOnClient(this.props.dispatch)
  }

  render () {
    return (
      <div>
        <Work { ...this.props }/>
      </div>
      )
  }
}

export default connect(
  state => {
    return {works: state.works}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(Works)


