import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NewsActions from '../actions/news'
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class News extends Component {

  componentDidMount() {
  }

  componentWillUpdate(){
  }

  componentDidUpdate() {
  }

  render () {
    const { news } = this.props

    var all = null;
    if (this.props.news) {
      if (this.props.news.all) {
        var all = (
          <ReactCSSTransitionGroup
            transitionName="work"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={400}
          >
           {news.all.map(function (item, i) {
              return (
                  <h1 key={i}>{item.title}</h1>
              )
            }, this)}
          </ReactCSSTransitionGroup>)
      }
    }

    return (
      <div className='newsParent'>
        {all}
      </div>
    )
  }
}

