import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import Work from '../components/Work';
import WorkItemComponent from '../components/WorkItem';
import * as WorkActions from '../actions/work'
// import { fetchWork } from '../api/work';
// import { fetchItem } from '../api/work';

if(process.env.BROWSER){
  require('./../../client/css/work.css');
}

export default class WorkItemContainer extends Component {

  static fetchItemData(dispatch, params) {
    var id = params.itemId
    console.log("FETCHING ITEM", id)
    var { loadWorkItem } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadWorkItem(id)
    ])
  }

  static fetchWorkData(dispatch) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadWork()
    ])
  }

  componentDidMount() {
    // console.log(this.props.state.works.length , "before fetch")
    this.constructor.fetchItemData(this.props.dispatch, this.props.params);

     if (this.props.state.works.length < 1) {
         this.constructor.fetchWorkData(this.props.dispatch);
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
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(WorkItemContainer)
