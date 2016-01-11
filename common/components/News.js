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
    this.filterNews();
    this.container = document.getElementById("newsList2")
    this.lastContainer = document.getElementById("newsList1")
    this.c1 = document.getElementById("newsList1");
    this.c2 = document.getElementById("newsList2");
    this.animateIn();
    setTimeout(function() {
      self.scroll();
    }, 1500);
  }


  scroll() {
    if (!this.props.location.hash) return;
    var hash = this.props.location.hash.slice(1, this.props.location.hash.length);
    var els = document.getElementsByClassName(hash);
    var selectedEl = els[els.length-1];
    console.log(hash, 'hash')
    console.log(selectedEl, 'selectedEl')
    if (!selectedEl.classList.contains('links-enter-active')) return;
    var scrollSelf = this;
    var scrollInterval = setInterval(function(){
      var elTop = selectedEl.getBoundingClientRect().top;
      if (elTop < 50) clearInterval(scrollInterval);
      var scrollY = window.scrollY;
      var newY = (scrollY + elTop)*.3;
      if (elTop > 0) {
        window.scrollTo(0, scrollY += (elTop*0.02))
      }
     }, 0);
  }

  componentDidUpdate() {
    var self = this;
    this.filterNews();
    self.animateOut()
    self.animateIn()
  }


  filterNews() {
    var self = this;
    this.news = [];
    const { state, params } = this.props;
    if (this.props.state.news) {
      if(params.filter) {
        state.news.forEach(function(item) {
          if (item.tags.indexOf(params.filter) > -1) {
            self.news.push(item)
          }
        })
      }
      else {
        this.news = this.props.state.news.slice();
      }
    }
  }

    animateIn () {
    const {state, dispatch } = this.props;
    var self = this;

    this.container.innerHTML = "";

    this.news.forEach(function(item, i){
      var el =
        `<section class='left'>
          ${item.image.main.url ? '<img src=' + item.image.main.url + ' />' : ''}
        </section>
        <section class='middle'>
          <h1>${item.title}</h1>
            <p class='location'>${item.location}</p>
            <p class='description'>${item.description}</p>
        </section>
        <section class='right'>
        ${item.link ? '<a href=' + item.link + ' target=_blank></a>' : ''}
        </section>`
      var div = document.createElement("div");
      div.className = "delay links-enter"
      div.innerHTML = el;
      // div.id = item.id;
      self.container.appendChild(div);
      setTimeout(function(){
        div.className += " " + item.id + " links-enter-active";
        // self.scroll();
      },10);
    })
  }

  animateOut() {
    var self = this;
    this.lastContainer.innerHTML = this.container.innerHTML;
    this.container.innerHTML = ""
    var els = this.lastContainer.getElementsByTagName('div');

    var i = els.length
    while (i--) {
      var el = els[i]
      // console.log(el, 'el')
      clearClass(el,'links-enter');
      el.className += " links-leave";
      leaveActive(el);
    }

    setTimeout( function(){
      var i = els.length
      while (i--) {
        var el = els[i]
        try{
          self.lastContainer.removeChild(el);
        } catch(err){}
      }
    }, 1300)

    function leaveActive(el){
      setTimeout(function(){
        el.className += " links-leave-active";
      },10);
    }

    function clearClass(el, prefix){
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = classes.join(" ").trim();
    }

  }

  render () {

    var instaList = null;

    if (this.props.state.news) {
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
        <div id='newsList1' className='left parent'></div>
        <div id='newsList2' className='left parent'></div>
        {instaList}
      </div>
    )
  }
}

