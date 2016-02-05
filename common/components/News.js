import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class News extends Component {


  componentDidMount() {
    var self = this;
    this.news = [];

    this.filterNews(this.props);
    this.container = document.getElementById("newsList2")
    this.lastContainer = document.getElementById("newsList1")
    this.c1 = document.getElementById("newsList1");
    this.c2 = document.getElementById("newsList2");
    // this.animateIn();

  }

  componentWillReceiveProps() {
  }

  scroll() {
    if (!this.props.location.hash) return;
    var hash = this.props.location.hash.slice(1, this.props.location.hash.length);
    var selectedEl = document.getElementById(hash);
    if (!selectedEl.classList.contains('news-enter-active')) return;
    var scrollSelf = this;
    var scrollInterval = setInterval(function(){
      var offTop = selectedEl.offsetTop + 7;
      var scrollY = window.scrollY;
      var newY = (offTop - scrollY);
      if (Math.abs(newY)>10) window.scrollTo(0, scrollY += (newY*0.1))
      else clearInterval(scrollInterval)
     }, 10);
  }

  componentWillUpdate(nextProps) {
    var self = this;
    this.filter = nextProps.params.filter
    this.filterNews(nextProps);
    if(this.oldNews && JSON.stringify(this.news) == JSON.stringify(this.oldNews)) return;
    this.oldNews = this.news;
    setTimeout(function() {
      if(self.news.length) self.scroll();
    }, 100);
  }


  filterNews(props) {
    var self = this;
    this.news = [];
    const { state, params } = props;
    if (this.props.state.news) {
      if(params.filter) {
        state.news.forEach(function(item) {
          if (item.tags.indexOf(params.filter) > -1) {
            self.news.push(item)
          }
        })
      }
      else {
        this.news = this.props.state.news.slice() || [];
      }
    }
  }

  render () {

    var self = this;
    var instaList = null;

    var insta = this.props.state.insta ? this.props.state.insta : [];
    var news = this.news || [];

    var el = news.map(function(item, i){

      var delay = (i % 20) * .05 + "s";
      var img =  item.image.main.url ? <img src={item.image.main.url } className='mobile-image' /> : ''
      var sectionStyle = {}
      if( item.image.main.url )
        sectionStyle =  {
          'backgroundImage': "url("+item.image.main.url+")"
        }
      var description = item.description ? <p className='description'>{item.description}</p> : ""; 
      var link = item.link ? <a href={item.link} target='_blank'></a> : ''
      return (
        <div id={item.id} className="news-item" style={{"transitionDelay" : delay}} key={item.id + self.filter}>
          {img}
          <section style={sectionStyle} className='left' >
            <article>
            <h1>{item.title}</h1>
            <p>{item.location}</p>
            </article>
          </section>

          <section className={item.description ? "middle" : "middle mobile-hide"}>
            <h1 class='desktop'>{item.title}</h1>
            <p class='location desktop'>{item.location}</p>
            {description}
          </section>

          <section className='right'>
            {link}
          </section>
        </div>
        )
    })


      instaList = (
        <div className='right parent'>
           {insta.map(function (item, i) {
            return (
              <a target='_blank' href={item.link} key={i}>
                <img src={item.images.standard_resolution.url} />
              </a>
            )
          }, this)}
        </div>
      )


    return (
      <div className='newsParent'>
{/*          <div id='newsList2' className='left parent'>
          <ReactCSSTransitionGroup
            transitionName="news"
            transitionAppear={true}
            transitionAppearTimeout={700}
            transitionEnterTimeout={700}
            transitionLeave={false}
          >
            {el}
          </ReactCSSTransitionGroup>
        </div> */}
         <div id='newsList2' className='left parent'>
          <ReactCSSTransitionGroup
            transitionName="news"
            transitionAppear={true}
            transitionAppearTimeout={700}
            transitionEnterTimeout={700}
            transitionLeave={false}
          >
            {el}
          </ReactCSSTransitionGroup>
        </div>
        {instaList}
      </div>
    )
  }
}

