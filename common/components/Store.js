import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import flexImages from './flex-full';

export default class Store extends Component {
  constructor() {
    super();
    this.worksLimit = 20;
    this.works = [];
    this.oldWorks = [];
    this.newWorks = [];
    this.loaded = 0;
  }
  componentDidMount() {

    var self = this;
    if (self.props.location.pathname == '/works') self.setState({selected: true});
    this.container = document.getElementById("flex-container2");
    this.containerOut = document.getElementById("flex-container1");
    this.container3d = document.getElementById("flex-images");

    window.addEventListener('scroll', this.handleScroll.bind(this));

    if (this.props.storeProp.products) {
      this.works = this.props.storeProp.products.slice(0, this.worksLimit);
      this.newWorks = this.works;
    }

    this.props.showLoader(true)
  }

  componentWillUpdate(nextProps) {
    this.updateNewWorks(nextProps)
  }

  componentDidUpdate(nextProps) {

    var self = this;
    this.flexGridLayout(this.container);
    this.flexGridLayout(this.containerOut);


    var els = self.container.getElementsByTagName('a');
    for(var i = 0; i < els.length; i++) {
      els[i].classList.remove('work-leave-active')
      els[i].className += " work-enter-active";
    }

    var els = self.containerOut.getElementsByTagName('a');
    for(var i = 0; i < els.length; i++) {
      els[i].classList.remove('work-enter-active')
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

  updateNewWorks(nextProps) {
    if (!nextProps.storeProp.products) return;
    this.works = nextProps.storeProp.products.slice(0, this.worksLimit);
    this.newWorks = this.works;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(e) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if(!this.params || !this.params.filter) return;

    this.timeout = setTimeout(function() {
      this.setPerspective();
      if(this.props.filteredWorks.length === this.works.length) return;

      var scrollTop = window.scrollY;
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

  loadImages(){
    this.loaded += 1;
    if(this.loaded == this.newWorks.length){
      this.ready = true;
      this.props.showLoader(false)
      this.setState({});
    }
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

  setPerspective(){
    var scrollTop = window.scrollY;
    var windowHeight = window.innerHeight;
    var pOrgin = "50% " + (scrollTop + windowHeight/2) + "px"
    this.container3d.style.perspectiveOrigin = pOrgin
    this.container3d.style.webkitPerspectiveOrigin = pOrgin
  }

  render () {
    let self = this;
    const { add } = this.props;
    var products = null;
    var firstImg = null;
    let newWorks;
    let oldWorks;

    function worksEl(worksArray, action) {
      var imgSize = 'small';

      return worksArray.map(function(item, i) {
        var specialStyle = '';
        var url = '/store/' + item.id;
        let img = item.images && item.images[0] && item.images[0].image ? item.images[0].image : item.images[0];
        if (item.coverImage) img = item.coverImage;
        return (
          <Link
            className={specialStyle + ' item ' + action}
            data-w={img.dimensions.width}
            data-h={img.dimensions.height}
            key={item.id+'_'+i}
            to={url}
            >
            <div className="imageContainer">
              <img
                key={item.id}
                src={img.url}
              />
              <div className="text">
                <p>{item.title}</p>
              </div>
            </div>
          </Link>
        );
      });
    }

    var images = this.newWorks.map(function(item, i){
      let img = item.images && item.images[0] && item.images[0].image ? item.images[0].image : item.images[0];
      // if (item.coverImage) img = item.coverImage;
      if(self.ready) return null;
      return (
        <img key={i} src={img.url}  onLoad={self.loadImages.bind(self)}/>
        )
    })

    if (!self.ready) {
      newWorks = [];
    } else {
      newWorks = worksEl(this.newWorks, 'work-enter');
    }

    oldWorks = worksEl(this.oldWorks, 'work-leave');


    var all = (
      <div className={'inherit3d'}>
        <div className={'inherit3d'} id="flex-container1">
            {oldWorks}
        </div>
        <div className={'inherit3d'} id="flex-container2">
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
