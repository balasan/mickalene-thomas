import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class News extends Component {

  constructor() {
    super();
    this.newsLimit = 5;
    this.news = [];
    this.oldNews= [];
    this.newNews = [];
    this.oldInsta = [];
    this.newInsta = [];
    this.instaLimit = 2;
    this.insta = [];
    // this.shuffled = [];
    // this.selectedNews = [];
    this.loaded = 0;
  }

  componentDidMount() {
    var self = this;

    // this.filterNews(this.props);
    // this.container = document.getElementById("newsList2")
    // this.lastContainer = document.getElementById("newsList1")
    // this.c1 = document.getElementById("newsList1");
    // this.c2 = document.getElementById("newsList2");
    // this.container = document.getElementById("newsList2");
    // this.containerOut = document.getElementById("newsList1");

    // this.instaContainer = document.getElementById("insta2");
    // this.instaContainerOut = document.getElementById("insta1");

    // this.container3d = document.getElementById("newsList1");

      window.addEventListener('scroll', this.handleScroll.bind(this));
    // this.animateIn();

    if(this.props.filteredNews){
      this.news = this.props.filteredNews.slice(0, this.newsLimit);;
      this.newNews = this.news;
    }
    if (this.props.state.insta) {
      this.insta = this.props.state.insta.slice(0, this.instaLimit);;
      this.newInsta = this.insta;
    }
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

  componentWillReceiveProps() {
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params, filteredNews, showLoader, instaData } = nextProps;

    if (this.props.state.insta && this.insta.length < 1) {
      this.insta = this.props.state.insta.slice(0, this.instaLimit);;
    }

    if(!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
      // this.oldNews = this.newNews.slice();
      // this.oldInsta = this.newInsta.slice();
      this.updateNewNews(nextProps);
      this.updateNewInsta(nextProps);
    }
    else if(!this.newNews.length || (this.oldNewsLimit != this.newsLimit)){
      this.updateNewNews(nextProps);
    }
    if(!this.newInsta.length || (this.oldInstaLimit != this.instaLimit)){
      this.updateNewInsta(nextProps);
    }
    self.params = params;

    setTimeout(function() {
      if(self.news.length) self.scroll();
    }, 100);
  }

  updateNewNews(nextProps) {
    const { params, filteredNews, instaData } = nextProps;
    this.news = filteredNews.slice(0, this.newsLimit);
    if(!params.filter)
      this.newNews = this.news;
    else this.newNews = filteredNews;
  }

  updateNewInsta(nextProps) {
    const { params, filteredNews, instaData } = nextProps;
    if (this.props.state.insta) {
      this.insta = this.props.state.insta.slice(0, this.instaLimit);
    } else {
      this.insta = [];
    }
    this.newInsta = this.insta;
  }

  shouldComponentUpdate(nextProps) {
    const { params, state } = nextProps;
    return true;
  }

  componentDidUpdate() {
    var self = this;

// setTimeout(function () {

//   var els = self.container.getElementsByTagName('a');
//   var instaEls = self.instaContainer.getElementsByTagName('a');

//   for(var i = 0; i < els.length; i++) {
//     if (!els[i].classList.contains('news-enter-active')) {
//       els[i].classList.add('news-enter-active');
//     }
//   }

//   for(var i = 0; i < instaEls.length; i++) {
//     if (!instaEls[i].classList.contains('news-enter-active')) {
//       instaEls[i].classList.add('news-enter-active');
//     }
//   }

// }, 250);


// setTimeout(function () {
//   var els = self.containerOut.getElementsByTagName('a');
//   var instaEls = self.instaContainerOut.getElementsByTagName('a');

//   for(var i = 0; i < els.length; i++) {
//     if (!els[i].classList.contains('news-leave-active')) {
//       els[i].classList.add('news-leave-active');
//     }
//   }

//   for(var i = 0; i < instaEls.length; i++) {
//     if (!instaEls[i].classList.contains('news-leave-active')) {
//       instaEls[i].classList.add('news-leave-active');
//     }
//   }
// }, 250);

    if(self.oldNews.length) {
      setTimeout(function(){
        // self.oldNews = [];
        self.setState({})
      },500)
    }
  }

  handleScroll(e) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function() {

      var scrollTop = document.body.scrollTop;
      var scrollHeight = document.body.scrollHeight;
      var clientHeight = document.body.clientHeight;
      console.log((scrollTop+clientHeight) / scrollHeight);

      if (((scrollTop+clientHeight) / scrollHeight) > 0.7) {
        if (this.newsLimit) {

          this.oldNewsLimit = this.newsLimit;
          this.oldInstaLimit = this.instaLimit;

          this.newsLimit = this.newsLimit + 5;
          this.instaLimit = this.instaLimit + 1;
          this.setState({});
        }
      }
    }.bind(this), 100);
  };


  render () {
    var instaList = null;
    var self = this, newNews, newInsta, oldInsta;

    var filterBool = true;
    if (self.params) {
      var filterBool = self.params.filter;
    }

    var selected = true;
    if(self.params && self.params.filter)
      selected = false;

    if( !self.props.state.news )  newNews = [];
    else newNews = newsEl(this.newNews, 'news-enter', selected);
    // oldNews = newsEl(this.oldNews, 'news-leave', selected);

    function newsEl(newsArray, action, selected) {
      return newsArray.map(function(item, i){
        var delay = (i % 20) * .05 + "s";
        var img =  item.image.main.url ? <img src={item.image.main.url } className='mobile-image' /> : ''
        var sectionStyle = {}
        if( item.image.main.url )
          sectionStyle =  {
            'backgroundImage': "url("+item.image.main.url+")"
          }
        var description = item.description ? <p className='description'>{item.description}</p> : "";
        var link = item.link ? <div></div> : null;

        return (
            <a id={item.id} target="blank" href={item.link ? item.link : 'javascript:'} className={item.link ? 'link news-item' : 'news-item'} style={{"transitionDelay" : delay}} key={item.id+self.params.filter+i}>
            {img}
            <section style={sectionStyle} className='left' >
              <article>
              <h1>{item.title}</h1>
              <p>{item.location}</p>
              </article>
            </section>

            <section className={item.description ? "middle" : "middle mobile-hide"}>
              <h1 className='desktop'>{item.title}</h1>
              <p className='location desktop'>{item.location}</p>
              {description}
            </section>

            <section className='right'>
            {link}
            </section>
          </a>
          )
      })
    }
    if (this.newInsta.length > 0) {
      newInsta = instaEl(this.newInsta, 'news-enter', selected);
    } else {
        if (this.props.state.insta) {
            var sliced = this.props.state.insta.slice(0,2);
            newInsta = instaEl(sliced, 'news-enter', selected);
        } else {
          newInsta = instaEl([], 'news-enter', selected);
        }
    }

    function instaEl(instaArray, action, selected) {
      return instaArray.map(function (item, i) {
       return (
         <a target='_blank' className='noselect' href={item.link} key={item.id}>
           <img src={item.images.standard_resolution.url} />
         </a>
       )
     }, this)
    }

    var all = (
      <div className='left parent'>

          <div>
              <ReactCSSTransitionGroup
            transitionName="news"
            transitionAppear={true}
            transitionAppearTimeout={700}
            transitionEnterTimeout={700}
            transitionLeave={false}
          >
              {newNews}
                  </ReactCSSTransitionGroup>
          </div>
      </div>)

      var allInsta = (
        <div className="right parent">
          <div className="insta-parent">
             <ReactCSSTransitionGroup
            transitionName="news"
            transitionAppear={true}
            transitionAppearTimeout={700}
            transitionEnterTimeout={700}
            transitionLeave={false}
          >
          {newInsta}
           </ReactCSSTransitionGroup>
          </div>
        </div>
      )

    return (
      <div className='newsParent'>
        {all}
        {allInsta}
      </div>
    )
  }
}
