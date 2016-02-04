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

  constructor() {
    super();
    //this.oldWorksLimit = 20;
    this.worksLimit = 20;
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
    var self = this;
    const { state, params, filteredWorks } = nextProps;

    // if (this.newWorks) {
    //   this.oldWorks = this.newWorks.slice();
    // }

    self.params = params;
    // this.filterWorks(state, params);
    this.works = filteredWorks.slice(0, this.worksLimit);;

    if (this.oldWorks && (JSON.stringify(this.works) == JSON.stringify(this.oldWorks))) return;

    //don't update if its the same stuff
    this.newWorks = this.works;
  }

  shouldComponentUpdate(nextProps) {
    console.log('shouldComponentUpdate', nextProps)
    const { params, state } = nextProps;
    if( params.itemId ) return false;
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
      rowHeight: 350,
    })
  }

  filterWorks(state, params) {
    var self = this;

    function isEven(n) {
      return n % 2 == 0;
    }

    self.works = state.works.filter(function(item) {
      if (params.filter && item.tags.indexOf(params.filter) === -1) {
        return false;
      } else {
        return true;
      }
    }).slice(0, this.worksLimit);

    if (state.news && !params.filter) {

      state.news.forEach(function(item, i) {
        var even = isEven(i);
        console.log(even, 'even')
        if (even)
          self.works.splice((i*5), 0, item);
        else
          self.works.splice(( (i*5) + 1 ), 0, item);
      });

    }
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
      // console.log(scrollTop);
      // console.log(e.srcElement.body.scrollHeight-e.srcElement.body.clientHeight);
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
              data-w={item.image.smaller.dimensions.width}
              data-h={item.image.smaller.dimensions.height}
              key={item.id+self.params.filter+i}
              to={'/works/i/' + item.id}>
              <div className="imageContainer">
                <img
                  className={item.tags[0] == 'paintings' || item.tags[0] == 'collages' || item.tags[0] == 'print' ? 'zoom' : ''}
                  key={item.id}
                  src={item.image.smaller.url}
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
                key={item.id+self.params.filter+i}
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
