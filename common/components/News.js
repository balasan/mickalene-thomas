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
    this.state = {
      newsLimit: 5,
      instaLimit: 3,
      disableLoad: false,
      limited: false
    }
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
    self.setState({limited: true});
  }

  componentWillReceiveProps(next) {
    var self = this;
    if (!next.params || self.props.params.filter != next.params.filter){
      window.scrollTo(0,0);
      self.setState({newsLimit: 5, instaLimit: 3, limited: false})
    }
  }

  componentDidUpdate() {
    var self = this;
  }

  handleScroll(e) {
    var self = this;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function() {

      var scrollTop = document.body.scrollTop;
      var scrollHeight = document.body.scrollHeight;
      var clientHeight = document.body.clientHeight;

      if (((scrollTop+clientHeight) / scrollHeight) > 0.7) {
        if (self.state.newsLimit) {
          self.setState({
            oldNewsLimit: self.state.newsLimit,
            oldInstaLimit: self.state.instaLimit,
            newsLimit: self.state.newsLimit + 5
          });
          if (!self.state.limited) {
            self.setState({instaLimit: self.state.instaLimit + 4})
          }
          if (!self.state.disableLoad && !self.state.limited) {
            self.setState({disableLoad: true})
            self.constructor.fetchMoreInstaData(self.props.state.insta.next, self.props.dispatch);
            setTimeout(function() {
              self.setState({disableLoad: false});
            }, 1000);
          }
        }
      }
      if (self.props.filteredNews.length <= self.state.newsLimit) {
        self.limitInsta();
      }

    }.bind(this), 100);
  };


  render () {
    var instaList = null;
    var self = this;
    var newNews = null;
    var newInsta = null;

    var filterBool = true;
    if (self.params) {
      var filterBool = self.params.filter;
    }

    if( !self.props.filteredNews) {
      newNews = null;
    } else {
      newNews = newsEl(self.props.filteredNews.slice(0, self.state.newsLimit), 'news-enter');
    }

    function newsEl(newsArray, action) {
      var arr = [];
      for (var x = 0; x < newsArray.length; x++) {
        var yearEl = null;
        var delay = (x % 20) * .05 + "s";
        var img = newsArray[x].image.main.url ? <img src={newsArray[x].image.main.url } className='mobile-image' /> : ''

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

        arr.push(<div style={{"transitionDelay" : delay}} key={newsArray[x].id+self.props.params.filter+x}><a id={newsArray[x].id} target="blank" href={newsArray[x].link ? newsArray[x].link : 'javascript:'} className={newsArray[x].link ? 'link news-item' : 'news-item'}>
            {img}
            <section className='left' >
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

    if (self.props.state.insta.data) {
      var sliced = this.props.state.insta.data.slice(0, self.state.instaLimit);
      newInsta = instaEl(sliced, 'news-enter');
    }

    function instaEl(instaArray, action) {
      return instaArray.map(function (item, i) {
        var delay = (i % 20) * .05 + "s";
       return (
         <a target='_blank' style={{"transitionDelay" : delay}} className='noselect insta' href={item.link} key={item.id+i}>
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
