import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import WorkItem from '../components/WorkItem';
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if (process.env.BROWSER) {
  require('./../../client/css/work.css');
}

class WorkParent extends Component {

  static fetchWorkOnClient(dispatch, filter) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }

  static fetchNewsOnClient(dispatch) {
    var { loadNews } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadNews()
    ])
  }

  static clearItemOnClient(dispatch) {
    var { clearItem } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      clearItem()
    ])
  }

  componentDidMount() {
    if (!this.props.works) {
      this.constructor.fetchWorkOnClient(this.props.dispatch, this.props.params.filter);
    }
    if (!this.props.news) {
       this.constructor.fetchNewsOnClient(this.props.dispatch);
    }
  }

  componentWillUnmount() {
    //whats going on here?
    // this.constructor.clearItemOnClient(this.props.dispatch)
  }

  render() {
    var showWorkItem = this.props.params.itemId ? '' : 'hidden';
    var showWorkGrid = this.props.params.itemId ? 'hidden' : '';

    return (
      <div>
        <div className={showWorkItem}>
          <Work { ...this.props } className={showWorkGrid}/>
        </div>
        <div className={'workItemContainer ' + showWorkItem}>
          <WorkItem { ...this.props }/>
        </div>
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
  })(WorkParent)


