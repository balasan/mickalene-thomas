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
    this.worksLimit = 10;
    this.works = [];
    this.worksOnly = [];
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params } = nextProps;
    if (!params.itemId) {
      this.filterWorks(state, params);
      this.closeUrl = params.filter ? '/works/filter/' + params.filter : '/works';
    }
    else if (!this.worksOnly.length) this.filterWorks(state, params);
  }

  componentWillUnmount() {
    //whats going on here?
    // this.constructor.clearItemOnClient(this.props.dispatch)
  }

  filterWorks(state, params) {
    var self = this;

    self.works = state.works.filter(function(item) {
      if (params.filter && item.tags.indexOf(params.filter) === -1) {
        return false;
      } else {
        return true;
      }
    });

    this.worksOnly = self.works.slice();

    if (state.news && !params.filter) {
      state.news.forEach(function(item, i) {

        self.works.splice((i*5), 0, item);

      });
    }
  }


  render() {
    var showWorkItem = this.props.params.itemId ? '' : 'hidden';
    var showWorkGrid = this.props.params.itemId ? 'hidden' : '';

    return (
      <div>
        <div className={'worksContainer ' + showWorkGrid}>
          <Work { ...this.props } filteredWorks={this.works} className={showWorkGrid}/>
        </div>
        <div className={'workItemContainer ' + showWorkItem} >
          <WorkItem { ...this.props } filteredWorks={this.worksOnly} closeUrl={this.closeUrl}/>
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


