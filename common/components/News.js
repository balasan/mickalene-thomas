import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NewsActions from '../actions/news'
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class News extends Component {

  componentDidMount() {
    console.log(this.props, "news props")
  }

  componentWillUpdate(){
  }

  componentDidUpdate() {
    console.log("news did update")
  }

  render () {
    const { news } = this.props

    var newsList = null;
    if (this.props.news) {
      if (this.props.news.all) {
        var newsList = (
          <ReactCSSTransitionGroup
            transitionName="work"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={400}
          >
           {news.all.map(function (item, i) {
              return (
                <div key={i}>
                  <section className='left'>
                    <img src={item.image.main.url} />
                  </section>
                  <section className='middle'>
                    <h1>{item.title}</h1>
                    <p className='location'>{item.location}</p>
                    <p className='description'>{item.description}</p>
                  </section>
                  <section className='right'>
                  <a href={item.link}></a>
                  </section>
                </div>
              )
            }, this)}
          </ReactCSSTransitionGroup>)
      }
    }

    return (
      <div className='newsParent'>
        {newsList}
      </div>
    )
  }
}

