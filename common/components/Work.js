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
    this.worksLimit = 20;
  }

  componentDidMount() {
    var self = this;
    this.oldWorks = [];
    this.newWorks = [];
    this.shuffled = [];
    this.selectedWorks = [];
    this.container = document.getElementById("flex-container2");
    this.containerOut = document.getElementById("flex-container1");
    this.container3d = document.getElementById("flex-images");
    window.addEventListener('scroll', this.handleScroll.bind(this));

    if(this.props.filteredWorks){
      this.works = this.props.filteredWorks.slice(0, this.worksLimit);;
      this.newWorks = this.works;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));

  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params, filteredWorks } = nextProps;

    if(!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
      this.oldWorks = this.newWorks.slice();
      this.updateNewWorks(nextProps);

    }
    else if(!this.newWorks.length || (this.oldWorksLimit != this.worksLimit)){
      this.updateNewWorks(nextProps);
    }

    // var preShuffle = this.works;
    // this.shuffled = this.shuffle(preShuffle);
    this.selectWork(filteredWorks);
    self.params = params;
  }

  updateNewWorks(nextProps) {
    const { params, filteredWorks } = nextProps;
    this.works = filteredWorks.slice(0, this.worksLimit);
    if(params.filter)
      this.newWorks = this.works;
    else this.newWorks = this.selectedWorks;
  }

  selectWork(work) {
    var self = this;
    work.forEach(function(item, i) {
      var currentTags = [];
      self.selectedWorks.forEach(function(selectedItem, i) {
        currentTags.push(selectedItem.tags[0]);
      });
      if (currentTags.indexOf(item.tags[0]) == -1) self.selectedWorks.push(item);
    });
  }

  shouldComponentUpdate(nextProps) {
    const { params, state } = nextProps;
    if( params.itemId ) return false;
    if(this.props.params.itemId && this.works && this.works.length) return false;
    return true;

    // if (this.works
    //   && (this.props.filteredWorks.length === this.works.length)
    //   && (params.filter == this.props.params.filter)
    //   // && this.worksLimit == this.oldWorksLimit
    //   ) {
    //    return false;
    // } else {return true};
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
    if(self.oldWorks.length) {
      setTimeout(function(){
        self.oldWorks = [];
        self.setState({})
      },500)
    }

    // this.newsColor();
    this.setPerspective();
  }

  // newsColor() {
  //   var newsEls = document.getElementsByClassName('newsItem');
  //   var i = 0;
  //   for (i = 0; i < newsEls.length; i+=3) {
  //     newsEls[i].classList.add('red');
  //   }
  //   for (i = 1; i < newsEls.length; i+=3) {
  //     newsEls[i].classList.add('blue');
  //   }
  //   for (i = 2; i < newsEls.length; i+=3) {
  //     newsEls[i].classList.add('brown');
  //   }
  // }


  // - INF SCROLLING -
  flexGridLayout(container) {
    var rowHeight = 400;

    if(this.newWorks.length < 20){
      rowHeight = 400;
    }
    else if(this.newWorks.length < 10){
      rowHeight = 600;
    }

    var hideSingle = false;
    var minCol = 2;
    var maxCol = 3;
    if(this.params.filter){
      hideSingle = true;
      // minCol = 2;
      maxCol = null;
    }
    this.flex = new flexImages({
      selector: container,
      container: '.item',
      rowHeight: rowHeight,
      truncate: false,
      hideSingle: hideSingle,
      // minCol: minCol,
      maxCol: maxCol
    })
  }

  handleScroll(e) {
    //basic debounce
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function() {
      //run, but wait again
      this.setPerspective();
      if(this.props.filteredWorks.length === this.works.length) return;

      var scrollTop = document.body.scrollTop;
      var scrollHeight = document.body.scrollHeight;
      var clientHeight = document.body.clientHeight;

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
    var self = this, newWorks, oldWorks, selectedWorks;

    var filterBool = true;
    if (self.params) {
      var filterBool = self.params.filter;
    }

    var selected = true;
    if(self.params && self.params.filter)
      selected = false;

    if (this.works) {
      newWorks = worksEl(this.newWorks, 'work-enter', selected);
    }
    if (this.oldWorks){
      oldWorks = worksEl(this.oldWorks, 'work-leave', selected);
    }
    // } else {
    //   if (this.selectedWorks) {
    //     newWorks = worksEl(this.selectedWorks, 'work-enter', true);
    //   }
    //   if (this.oldWorks){
    //     oldWorks = worksEl(this.oldWorks, 'work-leave', true);
    //   }
    // }

    function worksEl(worksArray, action, selected) {
      var imgSize = 'small';

        return worksArray.map(function(item, i) {
          return (
            <Link
              className={selected ? 'item special-selected '+action : 'item '+ action}
              data-w={item.image[imgSize].dimensions.width}
              data-h={item.image[imgSize].dimensions.height}
              key={item.id+self.params.filter+i}
              to={selected ? '/works/filter/'+item.tags[0] : '/works/i/' + item.id}
              >
              <div className="imageContainer">
                <img
                  className={item.tags[0] == 'paintings' || item.tags[0] == 'collages' || item.tags[0] == 'print' || item.tags[0] == 'sculpture' ? 'zoom' : ''}
                  key={item.id}
                  src={item.image[imgSize].url}
                />
                <div className="text">
                  <p>{selected ? item.tags[0] : item.title}</p>
                </div>
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
      <div id="flex-images" className='flex-images'>
        {all}
      </div>
    )
  }
}
