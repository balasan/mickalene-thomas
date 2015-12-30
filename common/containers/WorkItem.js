import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import Work from '../components/Work';
import WorkItemComponent from '../components/WorkItem';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';
import { fetchItem } from '../api/work';

if(process.env.BROWSER){
  require('./../../client/css/work.css');
}

export default class WorkItemContainer extends Component {

  static fetchData(dispatch, params) {
    var id = params.itemId
    console.log("FETCHING ITEM", id)
    var { loadWorkItem } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadWorkItem(id)
    ])
  }

  componentDidMount() {
    if (!this.props.workItem) {
      this.constructor.fetchData(this.props.dispatch, this.props.params);
    }
  }

  render () {
    return (
      <div>
        <WorkItemComponent { ...this.props }/>
      </div>
      )
  }
}

export default connect(
  state => {
    return {workItem: state.workItem}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(WorkItemContainer)
