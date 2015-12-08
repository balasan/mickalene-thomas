import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import SelectedWork from '../components/SelectedWork';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';
import { fetchItem } from '../api/work';

if(process.env.BROWSER){
  require('./../../client/css/work.css');
}

export default class Works extends Component {

  static fetchData(dispatch, filter) {
     console.log(filter, 'function filter')
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }


  componentDidMount() {
    if (!this.props.work) {
      this.constructor.fetchData(this.props.dispatch, this.props.params.filter);
    }
  }

  render () {
    return (
      <div>
       {/*  <SelectedWork { ...this.props }/> */}
        <Work { ...this.props }/>
      </div>
      )
  }
}

export default connect(
  state => {
    // console.log(state, 'work state')
    return {work: state.work}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(Works)


