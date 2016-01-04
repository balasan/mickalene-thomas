import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NewsActions from '../actions/news'
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class News extends Component {


  componentDidUpdate() {
    // var self = this;
    // this.filterNews();
  }

  filterNews() {
    // var self = this;
    // this.news = [];
    // const { state, params } = this.props;
    // console.log(state, 'state filter')
    // console.log(params, 'params filter')
    // if(params.filter)
    // state.news.all.forEach(function(item) {
    //   if (item.tags.indexOf(params.filter) > -1) {
    //     self.news.push(item)
    //   }
    // })
    // else this.news = this.props.news.all.slice();
  }

  render () {
    // const { news } = this.props
    console.log(this.props, 'news props')

    var newsList = null;
    var instaList = null;

    if (this.props.state.news) {
      if (this.props.state.news.all) {
        var newsList = (
          <ReactCSSTransitionGroup
            transitionName="work"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={400}
            component='div'
            className='left parent'
          >
           {this.props.state.news.all.map(function (item, i) {
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
      if (this.props.state.insta) {
        instaList = (
          <div className='right parent'>
             {this.props.state.insta.map(function (item, i) {
              return (
                <div key={i}>
                  <img src={item.images.standard_resolution.url} />
                </div>
              )
            }, this)}
          </div>
          )
      }
    }

    return (
      <div className='newsParent'>
        {newsList}
        {instaList}
      </div>
    )
  }
}

