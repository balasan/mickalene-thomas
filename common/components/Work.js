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

  constructor() {
    super();
    //this.oldWorksLimit = 20;
    this.worksLimit = 10;
  }

  componentDidMount() {
    var self = this;
    this.container = document.getElementById("flex-container2");
    this.containerOut = document.getElementById("flex-container1");

    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentWillUpdate(nextProps) {
    console.log('componentWillUpdate', nextProps);
    var self = this;
    const { state, params } = nextProps;

    // if (this.newWorks) {
    //   this.oldWorks = this.newWorks.slice();
    // }

    self.params = params;
    this.filterWorks(state, params);
    if (this.oldWorks && (JSON.stringify(this.works) == JSON.stringify(this.oldWorks))) return;

    //don't update if its the same stuff
    this.newWorks = this.works;
  }

  shouldComponentUpdate(nextProps) {
    console.log('shouldComponentUpdate', nextProps)
    const { params, state } = nextProps;
    if (this.works && (this.works.length === state.works.length) && (params.filter == this.props.params.filter) && this.worksLimit == this.oldWorksLimit) {
      return false;
    } else {return true};
  }

  componentDidUpdate() {
    var self = this;
    this.flexGridLayout(this.container);
    this.flexGridLayout(this.containerOut);

    // setTimeout(function(){
      var els = self.container.getElementsByTagName('a');
      for(var i = 0; i < els.length; i++) {
       els[i].className += " work-enter-active";
      }

      var els = self.containerOut.getElementsByTagName('a');
      for(var i = 0; i < els.length; i++) {
        els[i].className += " work-leave-active";
      }
    // },10);
  }

  flexGridLayout(container) {
    this.flex = new flexImages({
      selector: container,
      container: '.item',
      rowHeight: 300,
    })
  }

  filterWorks(state, params) {
    var self = this;
    console.log('state.works.length', state.works.length);
    console.log('params', params);
    // console.log(this, 'filterworks this')

    self.works = state.works.filter(function(item) {
      if (params.filter && item.tags.indexOf(params.filter) === -1) {
        return false;
      } else {
        return true;
      }
    }).slice(0, this.worksLimit);

    if (state.news && !params.filter) {
      state.news.forEach(function(item, i) {
        self.works.splice((i*4), 0, item);
      });
    }

    // if (params.filter) {
    //   console.log("START FILTER", params.filter);
    //   state.works.forEach(function(item) {
    //     if (item.tags.indexOf(params.filter) > -1) {
    //       self.works.push(item);
    //     }
    //   });
    //   // state.news.forEach(function(item) {
    //   //   if (item.tags.indexOf(params.filter) > -1) {
    //   //     self.works.push(item)
    //   //   }
    //   // })
    // } else if (state.works && state.news) {
    //   this.works = state.works.slice();

    //   state.news.forEach(function(item, i) {
    //     self.works.splice((i*4), 0, item)
    //   })

    // } else {
    //   this.works = state.works.slice();
    // }
    // console.log("DONE FILTER");
  }
  
  handleScroll(e) {
    //basic debounce
    if (this.timeout) {
    clearTimeout(this.timeout);
    } 
    this.timeout = setTimeout(function() {
      //run, but wait again
      var scrollTop = e.srcElement.body.scrollTop;
      var scrollHeight = e.srcElement.body.scrollHeight;
      var clientHeight = e.srcElement.body.clientHeight;
      if (((scrollTop+clientHeight) / scrollHeight) > 0.7) {
        if (this.worksLimit) { 
          this.oldWorksLimit = this.worksLimit;
          this.worksLimit = this.worksLimit + 10;
          this.setState({});
        }
      }
      console.log(scrollTop);
      console.log(e.srcElement.body.scrollHeight-e.srcElement.body.clientHeight);
    }.bind(this), 100);
  };

  render() {
    var self = this, newWorks, oldWorks;
    console.log(self.params);

    if (this.works) {
      newWorks = worksEl(this.works, 'work-enter');
    }

    if (this.oldWorks){
      oldWorks = worksEl(this.oldWorks, 'work-leave');
    }

    function worksEl(worksArray, action) {
      return worksArray.map(function(item, i) {
        if (item.type == 'work') {
          return (
            <Link
              className={'item '+ action}
              data-w={item.image.small.dimensions.width}
              data-h={item.image.small.dimensions.height}
              key={item.id+self.params.filter}
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
        } else { 
          return(
            <Link  data-h='500'
                data-w='500'
                key={item.id+self.params.filter}
                to={'/news#' + item.id}
                className={"item newsItem "+ action}>

              <div className="textNews">
                <p>{item.title}</p>
                <p>{item.location}</p>
              </div>
            </Link>
          );}
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
