import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ProductActions from '../actions/product'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';
// import SizeChart from '../components/SizeChart';

export default class Product extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentSize: null,
      currentStyle: null,
      currentVariation: null,
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
  }

  componentDidUpdate() {
  }

   openCart() {
        window.location.hash = '#cart';
    }

    doubleCart() {
      var self = this;
      var product = self.props.state.store.product;
      var warning = document.getElementById('warning');
      var regularProduct = JSON.parse(JSON.stringify(product));
      var productVariant = JSON.parse(JSON.stringify(product));
      var available = true;
      productVariant.variation = {};

      if (product.vars.length > 0 && product.sizes.length > 0) {
        if (self.state.currentSize && self.state.currentVariation) {
            productVariant.variation.size = self.state.currentSize;
            productVariant.variation.description = self.state.currentVariation.description;
            productVariant.variation.image = self.state.currentVariation.image;
            productVariant.variation.quanitity = self.state.currentVariation.quanitity;
            productVariant.variation.sku = self.state.currentVariation.sku;
            self.props.add(productVariant);
            self.openCart();
        } else {
          warning.innerHTML = 'must select size and style';
          warning.classList.remove('hidden');
        }
      } else if (product.vars.length > 0 && product.sizes.length == 0) {
        if (self.state.currentVariation) {
            productVariant.variation.description = self.state.currentVariation.description;
            productVariant.variation.image = self.state.currentVariation.image;
            productVariant.variation.quanitity = self.state.currentVariation.quanitity;
            productVariant.variation.sku = self.state.currentVariation.sku;
             self.props.add(productVariant);
            self.openCart();
        } else {
          warning.innerHTML = 'must select a style';
          warning.classList.remove('hidden');
        }
      } else if (product.vars.length == 0 && product.sizes.length > 0) {
          if (self.state.currentSize) {
            productVariant.variation.size = self.state.currentSize;
            self.props.add(productVariant);
            self.openCart();
        } else {
          warning.innerHTML = 'must select a size';
          warning.classList.remove('hidden');
        }
      }
      else {
        self.props.add(regularProduct);
        self.openCart();
      }
    }

    changeDropdown(value) {
      var ddl = document.getElementById('descriptions');
      if (!ddl) return;
      var opts = ddl.options.length;
      console.log(value, 'value')
      if (value) {
        for (var i = 0; i < opts; i++) {
          if (ddl.options[i].value == value){
            ddl.options[i].selected = true;
            break;
          }
        }
      } else {
        for (var i = 0; i < opts; i++) {
          ddl.options[i].selected = false;
        }
      }
    }

    switchImg(selected) {
      var self = this;
      var url;
      console.log(selected, 'switchimg selected')

      if (typeof selected == 'object') {
        self.setState({currentVariation: selected})
        url = selected.image;
        self.changeDropdown(selected.description);
      } else {
        url = selected;
        self.setState({currentVariation: null});
        self.changeDropdown(null);
      }

      var mainImg = document.getElementById('main-product-image');
      mainImg.classList.add('mask');
      setTimeout(function () {
        mainImg.src=url;
        mainImg.classList.remove('mask');
      }, 200);
      var single = document.getElementsByClassName('single-prod-image');
      var i = 0;
      for (i = 0; i < single.length; i++) {
        if (single[i].getAttribute('data-src') == url) {
          single[i].classList.add('selected')
        } else {
          if (single[i].classList.contains('selected')) {
             single[i].classList.remove('selected');
          }
        }
      }
    }

   optionSelect(e) {
      var self = this;
      var product = self.props.state.store.product;
      var warning = document.getElementById('warning');
      var selected = e.target.value;
      if (selected) {
        self.changeDropdown(selected);
        if (!warning.classList.contains('hidden')) {
          warning.classList.add('hidden')
        }
        product.vars.forEach(function(vari) {
          if (vari.description == selected) {
            self.switchImg(vari);
            self.setState({currentVariation: vari});
          }
        })
      }
    }

    sizeSelect(e) {
      var self = this;
      var warning = document.getElementById('warning');
      var size = e.target.value;
      if (size) {
        if (!warning.classList.contains('hidden')) {
          warning.classList.add('hidden')
        }
        self.setState({currentSize: size});
      }
    }

  render () {
    var productEl = null;
    var product = this.props.state.store.product;
    var showChart = this.props.state.store.showChart;
    const { add, toggleChart } = this.props;
    var self = this;
    var images = null;
    var dropDowns = null;
    var sizes = null;
    var descriptions = null;
    var chartImgLink = null;
    var sizeChart = null;
    var available = true;
    if (product) {
      if (!self.props.state.store.product.available) available = false;
    }

    if ( product && product.id == this.props.params.itemId ) {

      if (product.vars.length > 1) {

        var descriptions = product.vars.map(function(vari, i) {
          if (vari.description) {
            if (vari.available) {
              return (<option key={i} value={vari.description}>{vari.description}</option>);
            } else {
              return (<option key={i} value={vari.description} disabled>{vari.description}</option>);
            }
          }
        });
      }

      if (product.images.length > 1) {
          var images = product.images.map(function(vari, i) {
            var url;
            typeof vari == 'object' ? url = vari.image : url = vari;
            var divStyle = {
              background: 'white url(' + url + ') center center / contain no-repeat'
            };
            if (i == 0) {
              return (<div className='single-prod-image selected' onClick={self.switchImg.bind(self, vari)} data-src={url} style={divStyle}></div>)
            } else {
              return (<div className='single-prod-image' onClick={self.switchImg.bind(self, vari)} data-src={url} style={divStyle}></div>)
            }
        });
      }

      if (product.sizes.length > 1) {
        var availSizes = product.availSizes;
        var sizes = product.sizes.map(function(size, i) {
          if (availSizes.indexOf(size) > -1) {
            return (<option key={i} value={size}>{size}</option>);
          } else {
            return (<option key={i} value={size} disabled>{size}</option>);
          }
        });
      }

      if (product.sizeChart) {
        chartImgLink = (<a onClick={toggleChart}>Sizing chart</a>);
          sizeChart = (<div className={showChart ? 'size-chart' : 'size-chart hide'} onClick={toggleChart}><img src={product.sizeChart} /></div>);
      }

      if (product.vars.length > 1 && product.sizes.length > 1) {
        var dropDowns = (
          <div className='dropdowns-parent'>
            <select id="descriptions" onChange={self.optionSelect.bind(this)}>
              <option value="null">Select a style</option>
              {descriptions}
            </select>
            <select onChange={self.sizeSelect.bind(this)}>
              <option value="null">Select a size</option>
              {sizes}
            </select>

          </div>
        );
      } else if (product.vars.length > 1) {
        var dropDowns = (
          <div className='dropdowns-parent'>
            <select id="descriptions" onChange={self.optionSelect.bind(this)}>
              <option value="null">Select a style</option>
              {descriptions}
            </select>
          </div>
        );
      } else if (product.sizes.length > 1) {
        var dropDowns = (
          <div className='dropdowns-parent'>
            <select onChange={self.sizeSelect.bind(this)}>
            <option value="null">Select a size</option>
              {sizes}
            </select>
            {chartImgLink}
          </div>
        );
      }

      var buttonEl = null;

      if (product.price && product.available) {
        buttonEl = (<button className="noselect" onClick={self.doubleCart.bind(self)}>Add to Shopping Bag</button>)
      }

      if (product.price && !product.available) {
        buttonEl = (<button className="noselect">Sold Out</button>);
      }

      if (!product.price) {
        buttonEl = (<a href="mailto:hello@mickalenethomas.com" target="_blank" className="no-price noselect">Contact Us</a>);
      }

      if (product.externalURL) {
        buttonEl = (<a href={product.externalURL} className="no-price noselect" target="_blank">Go to purchase</a>);
      }

      if (self.state.currentVariation) {
        if (self.state.currentVariation.externalURL) {
          buttonEl = (<a href={self.state.currentVariation.externalURL} className="no-price noselect" target="_blank">Go to purchase</a>);
        }
      }

      var firstImg = null;
      if (typeof product.images[0] == 'string') {
        firstImg = product.images[0];
      } else {
        firstImg = product.images[0].image;
      }

      productEl = (

          <section className='productShowcase' key={product.id}>

            <div className="image noselect">
              <img id="main-product-image" className="imageContainer" src={firstImg} />
            </div>

            <div className="images-select noselect">
              {images}
            </div>

            <div className='info'>

              <section className='left'>
                <h1>{product.title}</h1>
                <div className='description'>
                  <p>{product.description}</p>
                  {self.state.currentVariation ? <p>{self.state.currentVariation.description}</p> : null}
                </div>

              </section>

              <section className='right'>
                <div className='top'>
                  <div>
                  {chartImgLink}
                  <p id='warning' className='hidden'></p>
                  {dropDowns}
                  </div>
                </div>

                <div className='bottom'>
                  {product.available ? <div className={product.price ? 'price' : 'price no-price'}>
                    <p>{product.price ? '$' : null}{product.price ? product.price.toFixed(2) : 'price available upon request'}</p>
                  </div> : null}
                  <div className='button-parent'>
                    {buttonEl}
                  </div>
                </div>

              </section>

            </div>

           {sizeChart}

          </section>
      )
    }


    return (
      <ReactCSSTransitionGroup
        transitionName="single"
        transitionAppear={true}
        transitionAppearTimeout={700}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={600}>
          {productEl}
      </ReactCSSTransitionGroup>
    )
  }
}
