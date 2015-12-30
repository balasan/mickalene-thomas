import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import range from 'lodash.range';
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactTransitionGroup from 'react-addons-transition-group';
import { updatePath } from 'redux-simple-router';
// var rsr=require('redux-simple-router')
// console.log(rsr);

// import {Motion, spring, TransitionMotion, StaggeredMotion} from 'react-motion';

export default class Work extends Component {

  componentDidMount() {
    var self = this;
    this.filterWorks();
    this.container = document.getElementById("flex-container2")
    this.lastContainer = document.getElementById("flex-container1")
    this.c1 = document.getElementById("flex-container1");
    this.c2 = document.getElementById("flex-container2");
    this.animateIn()
    self.flex = new flexImages({ selector: self.container, rowHeight: 250 })
  }


  componentDidUpdate() {
    var self = this;
    this.filterWorks();
    self.animateOut()
    self.animateIn()
    self.flex = new flexImages({
      selector: self.container,
      container: '.item:not(.work-leave)',
      rowHeight: 250,
    })
  }

  filterWorks() {
    var self = this;
    this.works = [];
    const { works, params } = this.props;
    if(params.filter)
    works.forEach(function(item) {
      if (item.tags.indexOf(params.filter) > -1) {
        self.works.push(item)
      }
    })
    else this.works = works.slice();
  }

  animateIn () {

    const {works, dispatch } = this.props;
    var self = this;

    this.container.innerHTML = "";

    this.works.forEach(function(item,i){
      var el =
        `<a
            class='item work-enter'
            data-w=${item.image.small.dimensions.width}
            data-h=${item.image.small.dimensions.height}
            key=${item.id}
            href=${'/works/i/' + item.id}>
          <img
              key=${item.id}
              src=${item.image.small.url}
            />
            <div class="text">
              <p>${item.title}</p>
            </div>
        </a>`
      var span = document.createElement("span");
      span.innerHTML = el;
      self.container.appendChild(span);
      span.getElementsByTagName('a')[0].onclick = function(e){
        e.preventDefault()
        dispatch(updatePath('/works/i/' + item.id))
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
    }, this.flex.maxDelay * 1000 + 300)
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
    // const { work } = this.props

    var all = null;

    // if (work) {
      // if (work.all) {
                var all = (
        <div>
        <div id="flex-container1"></div>
        <div id="flex-container2"></div>
{/*           <ReactCSSTransitionGroup
            transitionName="work"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={400}
          >
           {work.all.map(function (item, i) {
              return (
                  <Link className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={item.id} to={'/works/i/' + item.id}>
                    <img
                      key={item.id}
                      src={item.image.small.url}
                    />
                  </Link>
              )
            }, this)}
          </ReactCSSTransitionGroup> */}

        </div>)
              // }
    // }

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

