import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';
// import { Animation } from '../custom/animation';
var Animation = require('../custom/animation')
// var rsr=require('redux-simple-router')
// console.log(rsr);

export default class Work extends Component {

  componentDidMount() {
    var self = this;
    const { dispatch } = this.props;

    this.container = document.getElementById("flex-container2")
    this.animation = new Animation({
      newContainer: document.getElementById("flex-container2"),
      oldContainer: document.getElementById("flex-container1"),
      dispatch: dispatch,
      renderFunction: this.customRender,
      class: 'work'
    });

    this.filterWorks();
    this.animation.animateIn( this.works )
    this.flexGridLaout()

  }

  componentDidUpdate() {
    var self = this;
    this.filterWorks();
    //don't update if its the same stuff
    if(this.oldWorks && JSON.stringify(this.works) == JSON.stringify(this.oldWorks)) return;

    this.animation.animateOut( this.flex.maxDelay * 1000 + 600 )
    this.animation.animateIn( this.works )
    this.flexGridLaout()
  }

  flexGridLaout (){
    this.flex = new flexImages({
      selector: this.container,
      container: '.item:not(.work-leave)',
      rowHeight: 300,
    })
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


  customRender(item, dispatch) {
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
    return span;
  }




  render () {

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