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
    this.container = document.getElementById("flex-container2")
    this.containerOut = document.getElementById("flex-container1")
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params } = nextProps;

    if(this.newWorks)
      this.oldWorks = this.newWorks.slice();

    this.filterWorks(state, params);
    if(this.oldWorks && JSON.stringify(this.works) == JSON.stringify(this.oldWorks)) return;

    //don't update if its the same stuff
    this.newWorks = this.works;
  }

  shouldComponentUpdate(nextProps){
    const { params } = nextProps;
    if (this.works && this.works.length && params.filter == this.props.params.filter) return false
    else return true;
  }

  componentDidUpdate (){
    var self = this;
    this.flexGridLayout(this.container)
    this.flexGridLayout(this.containerOut)

    // setTimeout(function(){
      var els = self.container.getElementsByTagName('a');
      for(var i = 0; i < els.length; i++)
       els[i].className += " work-enter-active";

      var els = self.containerOut.getElementsByTagName('a');
      for(var i = 0; i < els.length; i++)
        els[i].className += " work-leave-active";
    // },10);

  }

  flexGridLayout (container){
    this.flex = new flexImages({
      selector: container,
      container: '.item',
      rowHeight: 300,
    })
  }

  filterWorks(state, params) {
    var self = this;
    this.works = [];
    // console.log(this, 'filterworks this')
    if(params.filter) {
      console.log("START FILTER", params.filter)
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
    console.log("DONE FILTER")
  }

  render () {

    var self = this;
    var newWorks = null;
    var oldWorks = null;

    if(this.works){
      newWorks = worksEl(this.works, 'work-enter')
    }
    if(this.oldWorks){
      oldWorks = worksEl(this.oldWorks, 'work-leave')
    }

    function worksEl(worksArray, action){
      return worksArray.map(function(item, i) {
        if (item.type == 'work')
          return (
            <Link
              className={'item '+ action}
              data-w={item.image.small.dimensions.width}
              data-h={item.image.small.dimensions.height}
              key={item.id + Math.random()}
              to={'/works/i/' + item.id}>
              <div className="imageContainer">
                <img
                  className={item.tags[0] == 'paintings' || item.tags[0] == 'collages' || item.tags[0] == 'print' ? 'zoom' : ''}
                  key={item.id}
                  src={item.image.small.url}
                />
                <div className="text">
                  <p>{item.title}</p>
                </div>
              </div>
            </Link>
          );
          else return(
            <Link  data-h='500'
                data-w='500'
                key={item.id + Math.random()}
                to={'/news#' + item.id}
                className={"item newsItem "+ action}>

              <div className="textNews">
                <p>{item.title}</p>
                <p>{item.location}</p>
              </div>
            </Link>
          );
      });
    }

    var all = (
        <div>
          <div id="flex-container1">
            {oldWorks}
          </div>
          <div id="flex-container2">
            {newWorks}
          </div>
        </div>)

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

