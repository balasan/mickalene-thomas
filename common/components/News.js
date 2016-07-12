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
    this.loaded = 0;
    this.disableLoad = false;
    this.limited = false;
  }

  static fetchMoreInstaData(url, dispatch) {
    var { loadInsta } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadInsta(url)
    ])
  }


  componentDidMount() {
    var self = this;
    window.addEventListener('scroll', this.handleScroll.bind(this));

    if(this.props.filteredNews){
      this.news = this.props.filteredNews.slice(0, this.newsLimit);
      this.newNews = this.news;
    }
    if (this.props.state.insta.data) {
      this.insta = this.props.state.insta.data.slice(0, this.instaLimit);
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

  limitInsta() {
    var self = this;
    var newsEl = document.getElementById('news-inner');
    var instaEls = document.getElementsByClassName('insta');
    var newsHeight = newsEl.offsetHeight;
    if (newsHeight == 0) return;
    for (var x in instaEls) {
      if (instaEls[x].offsetTop > newsHeight) {
        instaEls[x].style.display = "none";
      }
    }
    self.limited = true;
  }

  componentWillUpdate(nextProps) {
    var self = this;

    const { state, params, filteredNews, showLoader, instaData } = nextProps;

    if (this.props.state.insta.data && this.insta.length < 1) {
      this.insta = this.props.state.insta.data.slice(0, this.instaLimit);
    }

    if (self.props.state.insta.data.length != nextProps.state.insta.data.length) {
      self.setState({});
    }

    if (!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
      this.updateNewNews(nextProps);
      this.updateNewInsta(nextProps);
      this.newsLimit = 5;
      this.instaLimit = 2;
      this.limited = false;
    }

    else if(!this.newNews.length || (this.oldNewsLimit != this.newsLimit)){
      this.updateNewNews(nextProps);
    }
    if(!this.newInsta.length || (this.oldInstaLimit != this.instaLimit) && !self.limited){
      this.updateNewInsta(nextProps);
    }

    self.params = params;

    if (this.props.state.insta.data) {
        if (this.insta.length > 0 && this.insta.length == this.props.state.insta.data.length) {
          if (!self.disableLoad || !self.limited) {
            console.log('load more insta');
            self.constructor.fetchMoreInstaData(self.props.state.insta.next, self.props.dispatch);
          }
          self.disableLoad = true;
          setTimeout(function() {
            self.disableLoad = false;
          }, 10000);
        }
    }

    setTimeout(function() {
      if(self.news.length) self.scroll();
    }, 100);
  }

  updateNewNews(nextProps) {
    const { params, filteredNews, instaData } = nextProps;
    if (filteredNews) this.news = filteredNews.slice(0, this.newsLimit);
    if(!params.filter)
      this.newNews = this.news;
    else this.newNews = filteredNews;
  }

  updateNewInsta(nextProps) {
    const { params, filteredNews, instaData } = nextProps;
    if (this.props.state.insta.data) {
         this.insta = this.props.state.insta.data.slice(0, this.instaLimit);
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
    if(self.oldNews.length) {
      setTimeout(function(){
        self.setState({})
      },500)
    }
  }

  handleScroll(e) {
    var self = this;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (self.props.state.news.length <= self.newsLimit || self.props.filteredNews.length <= self.newsLimit && self.props.params.filter) {
      self.limitInsta();
    }

    this.timeout = setTimeout(function() {

      var scrollTop = document.body.scrollTop;
      var scrollHeight = document.body.scrollHeight;
      var clientHeight = document.body.clientHeight;

      if (((scrollTop+clientHeight) / scrollHeight) > 0.7) {
        if (this.newsLimit) {

          this.oldNewsLimit = this.newsLimit;
          this.oldInstaLimit = this.instaLimit;

          this.newsLimit = this.newsLimit + 5;
          this.instaLimit = this.instaLimit + 5;
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

    if( !self.props.state.news ) newNews = [];
    else newNews = newsEl(this.newNews, 'news-enter', selected);

    function newsEl(newsArray, action, selected) {
      var arr = [];
      for (var x = 0; x < newsArray.length; x++) {
        var yearEl = null;
        var delay = (x % 20) * .05 + "s";
        var img = newsArray[x].image.main.url ? <img src={newsArray[x].image.main.url } className='mobile-image' /> : ''
        var sectionStyle = {};
        if( newsArray[x].image.main.url ) {
          sectionStyle =  {
            // 'backgroundImage': "url("+newsArray[x].image.main.url+")"
          }
        }
        var description = newsArray[x].description ? <p className='description'>{newsArray[x].description}</p> : "";
        var link = newsArray[x].link ? <div></div> : null;
        var dateEl = null;

        if (newsArray[x+1]) {
          if (newsArray[x+1].date && newsArray[x].date) {
            var firstDate = new Date(newsArray[x].date);
            var secondDate = new Date(newsArray[x+1].date);
            var firstYear = firstDate.getFullYear();
            var secondYear = secondDate.getFullYear();
            if (firstYear != secondYear) {
              yearEl = (<p className="year">{secondYear}</p>);
            }
          }
        }

        arr.push(<div style={{"transitionDelay" : delay}} key={newsArray[x].id+self.params.filter+x}><a id={newsArray[x].id} target="blank" href={newsArray[x].link ? newsArray[x].link : 'javascript:'} className={newsArray[x].link ? 'link news-item' : 'news-item'}>
            {img}
            <section style={sectionStyle} className='left' >
              <img className="desktopNewsImg" src={newsArray[x].image.main.url} />
              <article>
                <h1>{newsArray[x].title}</h1>
                <p>{newsArray[x].location}</p>
              </article>
            </section>

            <section className={newsArray[x].description ? "middle" : "middle mobile-hide"}>
              <h1 className='desktop'>{newsArray[x].title}</h1>
              <p className='location desktop'>{newsArray[x].location}</p>
              {description}
            </section>

            <section className='right'>
              {link}
            </section>
          </a>{yearEl}</div>
        );
        if (x == newsArray.length - 1) return arr;
      }
    }
    if (this.newInsta.length > 0) {
      newInsta = instaEl(this.newInsta, 'news-enter', selected);
    } else {
        if (this.props.state.insta.data) {
            var sliced = this.props.state.insta.data.slice(0,2);
            newInsta = instaEl(sliced, 'news-enter', selected);
        } else {
          newInsta = instaEl([], 'news-enter', selected);
        }
    }

    function instaEl(instaArray, action, selected) {
      return instaArray.map(function (item, i) {
       return (
         <a target='_blank' className='noselect insta' href={item.link} key={item.id+i}>
           <img src={item.images.standard_resolution.url} />
         </a>
       )
     }, this)
    }

    var all = (
      <div className='left parent'>
        <div id="news-inner">
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
