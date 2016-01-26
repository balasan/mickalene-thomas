import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';
// var rsr=require('redux-simple-router')
// console.log(rsr);

export default class Work extends Component {

  componentDidMount() {
    var self = this;
    this.filterWorks();
    this.container = document.getElementById("flex-container2")
    this.lastContainer = document.getElementById("flex-container1")
    this.c1 = document.getElementById("flex-container1");
    this.c2 = document.getElementById("flex-container2");
    if(this.c1.innerHTML!=="") return;
    this.animateIn()
    self.flex = new flexImages({ selector: self.container, rowHeight: 300 })
  }

  componentDidUpdate() {
    var self = this;
    this.filterWorks();
    if(!self.updatedWorks()) return;
    self.animateOut()
    self.animateIn()
    self.flex = new flexImages({
      selector: self.container,
      container: '.item:not(.work-leave)',
      rowHeight: 300,
    })
  }

  updatedWorks() {
    var self = this;
    var updated = false;
    if(!self.oldWorks || self.oldWorks.length != this.works.length){
      updated = true;
        this.oldWorks = this.works.slice();
        return updated;
    }
    for(var i=0; i<this.works.length;i++){
      if(this.oldWorks && this.oldWorks[i] && this.works[i].id != this.oldWorks[i].id){
        updated = true;
        this.oldWorks = this.works.slice();
        return updated;
      }
    }
    this.oldWorks = this.works.slice();
    return updated;
  }

  filterWorks() {
    var self = this;
    this.works = [];
    // console.log(this, 'filterworks this')
    const { state, params } = this.props;
    if(params.filter) {
      state.works.forEach(function(item) {
        if (item.tags.indexOf(params.filter) > -1) {
          self.works.push(item)
        }
      })
      // state.news.forEach(function(item) {
      //   if (item.tags.indexOf(params.filter) > -1) {
      //     self.works.push(item)
      //   }
      // })
    } else if (state.works && state.news) {
      this.works = state.works.slice();

      state.news.forEach(function(item, i) {
        self.works.splice((i*4), 0, item)
      })

    } else {
      this.works = state.works.slice();
    }
  }

  animateIn () {

    const {works, dispatch } = this.props;

    var self = this;

    this.container.innerHTML = "";

    this.works.forEach(function(item,i){
      if (item.type == 'work') {
        var el =
        `<a
            class='item work-enter'
            data-w=${item.image.small.dimensions.width}
            data-h=${item.image.small.dimensions.height}
            key=${item.id}
            href=${'/works/i/' + item.id}>
            <div class="imageContainer">
              <img
                class=${item.tags[0] == 'paintings' || item.tags[0] == 'collages' || item.tags[0] == 'print' ? 'zoom' : ''}
                key=${item.id}
                src=${item.image.small.url}
              />
              <div class="text">
                <p>${item.title}</p>
              </div>
            </div>
        </a>`
      } else {
        var el = `<a data-h='500' data-w='500' class="item newsItem work-enter">
           <div class="textNews">
              <p>${item.title}</p>
              <p>${item.location}</p>
            </div>
        </a>`
      }
      var span = document.createElement("span");
      span.innerHTML = el;
      self.container.appendChild(span);
      span.getElementsByTagName('a')[0].onclick = function(e){
        e.preventDefault()
        if (item.type == 'work') {
          dispatch(updatePath('/works/i/' + item.id))
        } else {
           dispatch(updatePath('/news#' + item.id))
        }
      };
      setTimeout(function(){
        span.getElementsByTagName('a')[0].className += " work-enter-active";
      },10);
      // if(work.all.length == i+1) next()
    })
  }

  animateOut() {
    var self = this;
    this.lastContainer.innerHTML = this.container.innerHTML;
    this.container.innerHTML = ""
    var els = this.lastContainer.getElementsByTagName('span');

    // if(!els.length) return;
    var i = els.length
    while (i--) {
      var el = els[i].getElementsByTagName('a')[0]
      clearClass(el,'work-enter');
      el.className += " work-leave";
      leaveActive(el);
      // el.addEventListener("webkitTransitionEnd", removeEl);
      // el.addEventListener("transitionend", removeEl);
      // self.container.removeChild(el);
    }
    setTimeout( function(){
      var i = els.length
      while (i--) {
        var el = els[i]
        try{
          self.lastContainer.removeChild(el);
        } catch(err){}
      }
    }, this.flex.maxDelay * 1000 + 600)
    // function removeEl(e){
    //   var el = e.target;
    //   try{
    //     self.lastContainer.removeChild(el.parentNode);
    //   }
    //   catch(err){}
    // }

    function leaveActive(el){
      setTimeout(function(){
        el.className += " work-leave-active";
      },10);
    }
    // if(this.container.id == this.c1.id){
    //   this.container = this.c2
    //   this.lastContainer = this.c1
    // }
    // else {
    //   this.container = this.c1
    //   this.lastContainer = this.c2
    // }

    function clearClass(el, prefix){
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = classes.join(" ").trim();
    }

  }

  render () {

    // console.log(this, 'work render this')

    var all = null;
    var all = (
        <div>
        <div id="flex-container1"></div>
        <div id="flex-container2"></div>

        </div>)

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

