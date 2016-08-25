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
      limited: false,
      insta: []
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
    var newsEls = document.getElementsByClassName('news-item');
    var lastNews = newsEls[newsEls.length - 1];
    var newsDistance = lastNews.offsetTop + lastNews.offsetHeight;
    var instaEls = document.getElementsByClassName('insta');
    if (newsDistance == 0) return;
    for (var x in instaEls) {
      var instaDistance = instaEls[x].offsetTop + instaEls[x].offsetHeight;
      if (instaDistance > newsDistance) {
        instaEls[x].style.display = "none";
      }
    }
    self.setState({limited: true});
  }

  componentWillReceiveProps(next) {
    var self = this;
    if (next.state.insta.data && next.state.insta.data != self.state.insta) self.setState({insta: next.state.insta.data})
    if (!next.params || self.props.params.filter != next.params.filter){
      window.scrollTo(0,0);
      self.setState({newsLimit: 5, instaLimit: 3, limited: false})
    }
  }

  componentWillUpdate(nextProps, nextState) {
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
    var self = this;
    var instaList = null;
    var newsEl = null;
    var instaEl = null;

    var filterBool = true;
    if (self.params) {
      var filterBool = self.params.filter;
    }

    if (self.props.filteredNews) {
      newsEl = createNewsEl(self.props.filteredNews.slice(0, self.state.newsLimit), 'news-enter');
    }

    function createNewsEl(newsArray, action) {
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

        arr.push(<div key={newsArray[x].id+self.props.params.filter+x} className='news-item-parent'>
          <a style={{"transitionDelay" : delay}} className={newsArray[x].link ? 'link news-item' : 'news-item'} id={newsArray[x].id} target="blank" key={newsArray[x].id+self.props.params.filter+x+'child'} href={newsArray[x].link ? newsArray[x].link : 'javascript:'} >
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

    if (self.state.insta) {
      var finalArr = null;
      var sliced = self.state.insta.slice(0, self.state.instaLimit);
      if (self.state.limited) {
        finalArr = sliced;
        finalArr.push({special: true})
      } else {
        finalArr = sliced;
      }
      instaEl = createInstaEl(finalArr, 'news-enter');
    }

    function createInstaEl(instaArray, action) {
      return instaArray.map(function (item, i) {
        var delay = (i % 20) * .05 + "s";
        if (!item.special) {
          return (
            <a target='_blank' style={{"transitionDelay" : delay}} data-id={item.id} className='noselect insta' href={item.link} key={i}>
              <img src={item.images.standard_resolution.url} />
            </a>
          )
        } else {
          return (
            <a target='_blank' style={{"transitionDelay" : delay}} className='noselect special' key={i}>
              <p>Mickalene Thomas</p>
            </a>
          )
        }
      }, this)
    }

    var newsTransition = (
      <div className='left parent'>
        <div id="news-inner">
          <ReactCSSTransitionGroup
            transitionName="news"
            transitionAppear={true}
            transitionAppearTimeout={700}
            transitionEnterTimeout={700}
            transitionLeave={false}
          >
            {newsEl}
          </ReactCSSTransitionGroup>
        </div>
      </div>)

      var instaTransition = (
        <div className="right parent">
          <div className="insta-parent">
            <ReactCSSTransitionGroup
              transitionName="news"
              transitionAppear={true}
              transitionAppearTimeout={700}
              transitionEnterTimeout={700}
              transitionLeave={false}
            >
              {instaEl}
            </ReactCSSTransitionGroup>
          </div>
        </div>
      )

    return (
      <div className='newsParent'>
        {newsTransition}
        {instaTransition}
      </div>
    )
  }
}
