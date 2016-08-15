import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import * as MenuActions from '../actions/menu'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';
import ExhibitionSlide from '../components/ExhibitionSlide';

Number.prototype.mod = function(n) { return ((this % n) + n) % n; };

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

  static fetchExhibitionOnClient(dispatch, id) {
    var { loadExhibition } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadExhibition(id)
    ])
  }

  componentDidMount() {
    var self = this;
    this.constructor.fetchExhibitionOnClient(this.props.dispatch, this.props.params.itemId);
    if (self.props.state.works.exhibition) {
      if (self.props.state.works.exhibition.obj) self.createIndex(self.props);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    var self = this;
    if (nextProps.state.works.exhibition) {
      if (nextProps.state.works.exhibition.arr && nextState.prevIndex == null || self.props.params.imageId != nextProps.params.imageId) {
        self.createIndex(nextProps)
      }
    }
  }

  componentWillUnmount() {
    var self = this;
    self.props.actions.clearExhibition();
  }

  createIndex(nextProps) {
    var self = this;
    var item = null;
    var parentItem = null;
    parentItem = nextProps.state.works.exhibition.arr;
    item = nextProps.state.works.exhibition.obj[nextProps.params.imageId];

    var nextIndex = null;
    var prevIndex = null;

    parentItem.forEach(function(item, i) {
      if (item.id == nextProps.params.imageId) {
        nextIndex = i+1;
        prevIndex = i-1
      }
    })

    nextIndex = nextIndex.mod(parentItem.length);
    prevIndex = prevIndex.mod(parentItem.length);

    var nextItem = parentItem[nextIndex];
    var prevItem = parentItem[prevIndex];

    var imgN = new Image()
    imgN.src = nextItem.image.main.url;
    var imgP = new Image()
    imgP.src = nextItem.image.main.url;
    self.setState({nextIndex: nextIndex, prevIndex: prevIndex, item: item, parentItem: parentItem, nextItem: nextItem, prevItem: prevItem});
  }

  render () {
    var self = this;
    var related = false;
    if (self.state.parentItem) {
      if (self.state.parentItem.related) related = true;
    }

    const nextItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.state.nextItem.id))
    }
    const prevItem = function() {
      self.props.dispatch(updatePath('/works/exhibitions/'+self.props.params.itemId+'/' + self.state.prevItem.id))
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
          <ExhibitionSlide workItem={self.state.item} nextIndex={self.state.nextIndex} prevIndex={self.state.prevIndex} {...this.props} />
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