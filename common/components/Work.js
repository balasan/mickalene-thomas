import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';

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
    this.container3d = document.getElementById("flex-images");
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params, filteredWorks } = nextProps;
    // if (this.newWorks)
      // this.oldWorks = this.newWorks.slice();
    self.params = params;
    if(this.params.filter != params.filter) window.scrollTo(0,0);
    this.works = filteredWorks.slice(0, this.worksLimit);;
    this.newWorks = this.works;
  }

  shouldComponentUpdate(nextProps) {
    const { params, state } = nextProps;
    if( params.itemId ) return false;
    if (this.works
      // && (this.works.length === state.works.length)
      && (params.filter == this.props.params.filter)
      && this.worksLimit == this.oldWorksLimit) {
      return false;
    } else {return true};
  }

  componentDidUpdate() {
    var self = this;
    this.flexGridLayout(this.container);
    this.flexGridLayout(this.containerOut);

    var els = self.container.getElementsByTagName('a');
    for(var i = 0; i < els.length; i++) {
     els[i].className += " work-enter-active";
    }

    var els = self.containerOut.getElementsByTagName('a');
    for(var i = 0; i < els.length; i++) {
      els[i].className += " work-leave-active";
    }
    this.newsColor();
    this.setPerspective();
  }

  newsColor() {
    var newsEls = document.getElementsByClassName('newsItem');
    var i = 0;
    for (i = 0; i < newsEls.length; i+=3) {
      newsEls[i].classList.add('red');
    }
    for (i = 1; i < newsEls.length; i+=3) {
      newsEls[i].classList.add('blue');
    }
    for (i = 2; i < newsEls.length; i+=3) {
      newsEls[i].classList.add('brown');
    }
  }

  flexGridLayout(container) {
    this.flex = new flexImages({
      selector: container,
      container: '.item',
      rowHeight: 350,
    })
  }

  handleScroll(e) {
    //basic debounce
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function() {
      //run, but wait again
      var scrollTop = document.body.scrollTop;
      var scrollHeight = document.body.scrollHeight;
      var clientHeight = document.body.clientHeight;
      this.setPerspective();
      if (((scrollTop+clientHeight) / scrollHeight) > 0.7) {
        if (this.worksLimit) {
          this.oldWorksLimit = this.worksLimit;
          this.worksLimit = this.worksLimit + 10;
          this.setState({});
        }
      }
    }.bind(this), 100);
  };

  setPerspective(){
    var scrollTop = document.body.scrollTop;
    var windowHeight = window.innerHeight;
    var pOrgin = "50% " + (scrollTop + windowHeight/2) + "px"
    this.container3d.style.perspectiveOrigin = pOrgin
    this.container3d.style.webkitPerspectiveOrigin = pOrgin
  }

  render() {
    var self = this, newWorks, oldWorks;
    // console.log(self.params);

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
      <div id="flex-images" className='flex-images'>
        {all}
      </div>
    )
  }
}
