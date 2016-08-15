import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import WorkItem from '../components/WorkItem';
import * as WorkActions from '../actions/work'
import * as MenuActions from '../actions/menu'
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
    this.closeUrl = '/works';
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



  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  filterWorks(state, params) {
    var self = this;
    var preShuffle = state.works.arr;
    var shuffled = this.shuffle(preShuffle);

      self.works = shuffled.filter(function(item) {
        if (params.filter && item.tags.indexOf(params.filter) === -1) {
          return false;
        } else {
          return true;
        }
      });

    this.worksOnly = self.works.slice();
  }


  render() {
    var self = this;
    var itemId = self.props.params.itemId;
    var showWorkItem = null;
    var showWorkGrid = null;

    if (itemId) {
      showWorkItem = '';
      showWorkGrid = 'hidden';
    } else {
      showWorkItem = 'hidden';
      showWorkGrid = '';
    }

    return (
      <div className="container3d">
        <div className={'worksContainer ' + showWorkGrid}>
          <Work { ...this.props } filteredWorks={self.works} className={showWorkGrid}/>
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
    return Object.assign({}, { dispatch },  bindActionCreators(Object.assign({}, MenuActions, WorkActions), dispatch))
  })(WorkParent)
