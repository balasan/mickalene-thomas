import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import Work from '../components/Work';
import SelectedComponent from '../components/SelectedComponent';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';
import { fetchItem } from '../api/work';

if(process.env.BROWSER){
  require('./../../client/css/work.css');
}

export default class Selected extends Component {

  // static fetchData(dispatch, filter) {
  //   var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
  //   return Promise.all([
  //     loadWork(filter)
  //   ])
  // }

  static fetchItem(dispatch, id) {
    var { loadItem } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadItem(id)
    ])
  }


  componentDidMount() {
    if (!this.props.work || !this.props.work.currentitem) {
      // this.constructor.fetchData(this.props.dispatch, this.props.params.filter);
      this.constructor.fetchItem(this.props.dispatch, this.props.params.itemId);
    }
  }

  render () {
    return (
      <div>
        <SelectedComponent { ...this.props }/>
      </div>
      )
  }
}

export default connect(
  state => {
    return {work: state.work}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(Selected)
