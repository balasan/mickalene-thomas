import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import WorkItem from '../components/WorkItem';
import * as WorkActions from '../actions/work'
import * as MenuActions from '../actions/menu'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if (process.env.BROWSER) require('./../../client/css/work.css');

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

  static fetchExhibitionOnClient(dispatch, id) {
    var { loadExhibition } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadExhibition(id)
    ])
  }

  componentDidMount() {
    var self = this;
    if (!this.props.state.works.arr.length) {
      this.constructor.fetchWorkOnClient(this.props.dispatch, this.props.params.filter);
    }
    if (!this.props.news) {
       this.constructor.fetchNewsOnClient(this.props.dispatch);
    }
    if (self.props.params.exhibitionId) {
      this.constructor.fetchExhibitionOnClient(self.props.dispatch, self.props.params.exhibitionId);
    }
    this.worksLimit = 10;
    this.works = [];
    this.worksOnly = [];
    this.closeUrl = '/works';
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params } = nextProps;
    if (nextProps.params.exhibitionId != self.props.params.exhibitionId) {
      this.constructor.fetchExhibitionOnClient(self.props.dispatch, nextProps.params.exhibitionId);
    }
    if (!params.itemId && !params.exhibitionId) {
      this.closeUrl = params.filter ? '/works/filter/' + params.filter : '/works';
    }
    if (params.exhibitionId) {
      this.closeUrl = '/works/exhibitions/' + params.exhibitionId;
    }
    this.filterWorks(nextProps, params);
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

  filterWorks(props, params) {
    var self = this;

    if (props.params.exhibitionId) {
      if (props.state.works.exhibition.arr) {
        var preShuffle = props.state.works.exhibition.arr;
      } else {
        var preShuffle = [];
      }
    } else {
      var preShuffle = props.state.works.arr;
    }
    
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
    var exhibitionId = self.props.params.exhibitonId;
    var showWorkItem = null;
    var showWorkGrid = null;
    var workObj = null;
    var exhibition = exhibitionId ? true : false;
    var exhibitionItemId = self.props.params.exhibitionItemId ? true : false;


    if (itemId && !exhibition) {
      showWorkItem = '';
      showWorkGrid = 'hidden';
    } else if (exhibitionItemId) {
      showWorkItem = '';
      showWorkGrid = 'hidden';
    } else {
      showWorkItem = 'hidden';
      showWorkGrid = '';
    }

    // console.log('show work item?', showWorkItem == '');
    // console.log(self.works, 'works');
    // console.log(exhibitionItemId);

    return (
      <div className="container3d">
        <div className={'worksContainer ' + showWorkGrid}>
          <Work { ...this.props } filteredWorks={self.works} className={showWorkGrid}/>
        </div>
        <div className={'workItemContainer ' + showWorkItem} >
          <WorkItem { ...this.props } filteredWorks={exhibitionItemId ? self.works : self.worksOnly} closeUrl={this.closeUrl}/>
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
