import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

// const Counter = (props) => {
export default class SelectedWork extends Component {

  static fetchItem(dispatch, id) {
    var { loadItem } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadItem(id)
    ])
  }

  componentDidMount() {
      if (this.props.routeParams.itemId) {
         var id = this.props.routeParams.itemId;
        this.constructor.fetchItem(this.props.dispatch, id);
      } else {
        console.log("no id")
      }
  }

  render () {

    const { work, clickitem } = this.props

    if( !work ) return null;

    var selectedWork;

    if ( work.currentitem ) {
      selectedWork = (
        <section className='showcase'>
          <div className="image">
            <img src={work.currentitem[0].image} />
          </div>
          <div className="description">
            <div>
              <p>{work.currentitem[0].title}</p>
              <p>{work.currentitem[0].date.substr(0, 4)}</p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <div>
        {selectedWork}
        </div>
    )
  }
}

