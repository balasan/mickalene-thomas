import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WorkActions from '../actions/work';
import flexImages from './flex-full';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Work extends Component {
  constructor() {
    super();
    this.state = {
      selected:  false
    };
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
    if (self.props.location.pathname == '/works') self.setState({selected: true});
    this.container = document.getElementById("flex-container2");
    this.containerOut = document.getElementById("flex-container1");
    this.container3d = document.getElementById("flex-images");

    window.addEventListener('scroll', this.handleScroll.bind(this));

    if (this.props.filteredWorks) {
      this.works = this.props.filteredWorks.slice(0, this.worksLimit);
      this.newWorks = this.works;
    }

    this.props.showLoader(true)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params, filteredWorks, showLoader } = nextProps;

    if (nextProps.location.pathname != self.props.location.pathname) {
      if (nextProps.location.pathname != '/works') {
        if (self.state.selected) {
          self.setState({selected: false});
        }
      }
    }

    if(!params || this.props.params.filter != params.filter){
      window.scrollTo(0,0);
      this.oldWorks = this.newWorks.slice();
      this.updateNewWorks(nextProps);
      this.loaded = 0;
      this.ready = false;
      if (!nextProps.state.menu.showLoader) showLoader(true)
    } else if (!this.newWorks.length || (this.oldWorksLimit != this.worksLimit)) {
      this.updateNewWorks(nextProps);
    }
    this.selectWork(filteredWorks);
    self.params = params;
  }

  updateNewWorks(nextProps) {
    const { params, filteredWorks } = nextProps;
    this.works = filteredWorks.slice(0, this.worksLimit);
    if (params.filter || params.exhibitionId) {
      this.newWorks = this.works;
    } else {
      this.newWorks = this.selectedWorks;
    }
  }

  selectWork(work) {
    var self = this;
    work.forEach(function(item, i) {
      var currentTags = [];
      self.selectedWorks.forEach(function(selectedItem, i) {
        if (selectedItem.tags && selectedItem.tags[0]) currentTags.push(selectedItem.tags[0]);
      });
      if (item.tags && item.tags[0]) {
        if (currentTags.indexOf(item.tags[0]) == -1) self.selectedWorks.push(item);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    var self = this;
    this.flexGridLayout(this.container);
    this.flexGridLayout(this.containerOut);

    if (prevProps.location.pathname != self.props.location.pathname) {
      if (self.props.location.pathname == '/works') {
        if (!self.state.selected) {
            self.setState({selected: true});
        }
      }
    }

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
    if(this.params.filter){
      maxCol = null;
    }
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
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if(!this.params || !this.params.filter) return;

    this.timeout = setTimeout(function() {
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

  loadImages(){
    this.loaded += 1;
    if(this.loaded == this.newWorks.length){
      this.ready = true;
      this.props.showLoader(false)
      this.setState({});
    }
  }

  render() {
    var self = this, newWorks, oldWorks, selectedWorks;
    var selectedState = this.state.selected;
    var filterBool = true;
    if (self.params) var filterBool = self.params.filter;
    if (!self.ready) {
      newWorks = [];
    } else {
      newWorks = worksEl(this.newWorks, 'work-enter');
    }

    oldWorks = worksEl(this.oldWorks, 'work-leave');

    function worksEl(worksArray, action) {
      var imgSize = 'small';

      return worksArray.map(function(item, i) {
        var url = null;
        var specialStyle = '';

        if (selectedState) {
          url = '/works/filter/'+item.tags[0];
          specialStyle='special-selected';
        } else  {
          if (self.props.params.filter == 'exhibitions') {
             url = '/works/exhibitions/'+ item.id;
          } else {
            if (self.props.params.exhibitionId) {
              url = '/works/exhibitions/'+ self.props.params.exhibitionId + '/' + item.id;
            } else {
              url = '/works/i/' + item.id;
            }
          }
        }

        return (
          <Link
            className={specialStyle + ' item ' + action}
            data-w={item.image[imgSize].dimensions.width}
            data-h={item.image[imgSize].dimensions.height}
            key={item.id+'_'+i}
            to={url}
            >
            <div className="imageContainer">
              <img
                className={item.tags[0] == 'paintings' || item.tags[0] == 'collages' || item.tags[0] == 'print' || item.tags[0] == 'sculpture' ? 'zoom' : ''}
                key={item.id}
                src={item.image[imgSize].url}
              />
              <div className="text">
                <p>{selectedState ? item.tags[0] : item.title}</p>
              </div>
            </div>
          </Link>
        );
      });
    }

    var imgSize = 'small';

    var images = this.newWorks.map(function(item, i){
      if(self.ready) return null;
      return (
        <img key={i} src={item.image[imgSize].url}  onLoad={self.loadImages.bind(self)}/>
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