import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';

export default class ExhibitionImages extends Component {
  constructor() {
    super();
    this.worksLimit = 20;
    this.works = [];
    this.oldWorks = [];
    this.newWorks = [];
    this.shuffled = [];
    this.works = [];
    this.selectedWorks = [];
    this.loaded = 0;
  }

  componentDidMount() {
    var self = this;
    this.container = document.getElementById("flex-container2");
    this.containerOut = document.getElementById("flex-container1");
    this.container3d = document.getElementById("flex-images");

    window.addEventListener('scroll', this.handleScroll.bind(this));

    if (this.props.filteredWorks) {
      this.works = this.props.filteredWorks.slice(0, this.worksLimit);
      this.newWorks = this.works;
      this.updateNewWorks(self.props);
      self.setState({})
    }
  }

  componentWillUnmount() {
    this.worksLimit = 20;
    this.works = [];
    this.oldWorks = [];
    this.newWorks = [];
    this.shuffled = [];
    this.works = [];
    this.selectedWorks = [];
    this.loaded = 0;
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params, filteredWorks, showLoader } = nextProps;
    if(!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
      this.oldWorks = this.newWorks.slice();
      this.updateNewWorks(nextProps);
      this.loaded = 0;
      this.ready = false;
      if(!nextProps.state.menu.showLoader)
        showLoader(true)
    }
    else if(self.newWorks != nextProps.filteredWorks || (this.oldWorksLimit != this.worksLimit)){
      this.updateNewWorks(nextProps);
    }
    this.updateNewWorks(nextProps);
  }

  updateNewWorks(nextProps) {
    var self = this;
    const { params, filteredWorks } = nextProps;
    if (filteredWorks) {
      this.works = filteredWorks.slice(0, this.worksLimit);
      this.newWorks = this.works;
    }
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
    this.setPerspective();
  }

  componentWillUnmount() {
    this.props.showLoader(false)
  }

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
    this.flex = new flexImages({
      selector: container,
      container: '.item',
      rowHeight: rowHeight,
      truncate: false,
      hideSingle: hideSingle,
      maxCol: maxCol
    })
  }

  handleScroll(e) {
    var self = this;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if(!this.params || !this.params.filter) return;

    this.timeout = setTimeout(function() {
      this.setPerspective();
      if (this.props.filteredWorks.length === this.works.length) return;

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

  loadImages(){
    this.loaded += 1;
    if(this.loaded == this.newWorks.length){
      this.ready = true;
      this.props.showLoader(false)
      this.setState({});
    }
  }

  render() {
    var self = this, newWorks, oldWorks;
    newWorks = worksEl(this.newWorks, 'work-enter');
    oldWorks = worksEl(this.oldWorks, 'work-leave');

    function worksEl(worksArray, action) {
      return worksArray.map(function(item, i) {
        var url = '/works/exhibitions/'+self.props.params.itemId+'/'+i;
        return (
          <Link
            className={'item '+ action}
            data-w={item.image.small.dimensions.width}
            data-h={item.image.small.dimensions.height}
            key={i+action}
            to={url}
            >
            <div className="worksContainer">
              <img src={item.image.small.url} />
              <div className="text">
                <p>{item.title}</p>
              </div>
            </div>

          </Link>
        );
      });
    }

    var images = self.newWorks.map(function(item, i){
      if (self.ready) return null;
      return (
        <img key={i+'whatev'} src={item.image.small.url}  onLoad={self.loadImages.bind(self)}/>
        )
    })
    var all = (
        <div>
          <div id="flex-container1">
              {oldWorks}
          </div>
          <div id="flex-container2">
              {newWorks}
          </div>
          <div id="loadingWorks">
            {images}
          </div>
        </div>)


    return (
      <div id="flex-images" className='flex-images'>
        {all}
      </div>
    )
  }
}
