import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import * as MenuActions from '../actions/menu'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';
import ExhibitionSlide from '../components/ExhibitionSlide';

class ExhibitionItem extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      item: null,
      parentItem: null,
      nextIndex: null,
      prevIndex: null
    }
  }

  static fetchWorkOnClient(dispatch, filter) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }

  componentDidMount() {
    var self = this;
    if (!this.props.state.works.obj) {
      this.constructor.fetchWorkOnClient(this.props.dispatch, this.props.params.filter);
    }
    if (self.props.state.works.obj) {
      self.createIndex(self.props);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    var self = this;
    if (nextProps.state.works.obj && nextState.prevIndex == null || self.props.params.imageId != nextProps.params.imageId) {
      self.createIndex(nextProps)
    }
  }

  createIndex(nextProps) {
    var self = this;
    var item = null;
    var parentItem = null;
    parentItem = nextProps.state.works.obj[nextProps.params.itemId];
    item = parentItem.exhibitionImages[nextProps.params.imageId];
    var imageId = Number(nextProps.params.imageId);
    var length = parentItem.exhibitionImages.length;
    var nextIndex = null;
    var prevIndex = null;

    if (imageId == length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = imageId + 1;
    }

    if (imageId == 0) {
      prevIndex = length - 1;
    } else {
      prevIndex = imageId - 1;
    }

    var nextItem = parentItem.exhibitionImages[nextIndex];
    var prevItem = parentItem.exhibitionImages[prevIndex];

    var imgN = new Image()
    imgN.src = nextItem.url;
    var imgP = new Image()
    imgP.src = prevItem.url;
    self.setState({nextIndex: nextIndex, prevIndex: prevIndex, item: item, parentItem: parentItem});
  }

  render () {
    var self = this;
    var related = false;
    if (self.state.parentItem) {
      if (self.state.parentItem.related) related = true;
    }

    const nextItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.state.nextIndex))
    }
    const prevItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.state.prevIndex))
    }
    const closeItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId))
    }

    const { state, clickitem } = this.props

    var arrows = (
      <div className={related ? 'arrowsParent' : "arrowsParentExhib"}>
        <section onClick={prevItem} className="left"></section>
        <section className="middle"></section>
        <section onClick={nextItem} className="right"></section>
      </div>
    )

    return (
      <div className='selectedWork'>
        <section className='showcase'>
          <ExhibitionSlide workItem={self.state.item} nextIndex={self.state.nextIndex} prevIndex={self.state.prevIndex} {...this.props} >
          </ExhibitionSlide>
          {arrows}
        </section>
        <img className={'closeItem noselect'} onClick={closeItem} src={'/images/close.svg'} />
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
  })(ExhibitionItem)