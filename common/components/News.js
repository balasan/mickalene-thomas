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
      this.news = this.props.filteredNews.slice(0, this.newsLimit);;
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

  componentWillReceiveProps() {
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

    if(!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
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

    if (this.props.state.insta.data) {
        if (this.insta.length > 0 && this.insta.length == this.props.state.insta.data.length) {
          if (!self.disableLoad) {
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
    this.news = filteredNews.slice(0, this.newsLimit);
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
    if (this.timeout) {
      clearTimeout(this.timeout);
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
         <a target='_blank' className='noselect' href={item.link} key={item.id+i}>
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
