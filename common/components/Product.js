import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ProductActions from '../actions/product'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';

export default class Product extends Component {

  componentDidMount() {
    window.scrollTo(0,0);
    this.currentSize = null;
    this.currentStyle = null;
  }

  componentDidUpdate() {
  }

  render () {
    var productEl = null;
    var product = this.props.state.store.product;
    console.log(product, 'product');
    const { add } = this.props;
    var self = this;

    const openCart = function() {
        window.location.hash = '#cart';
    }

    const doubleCart = function() {
      var regularProduct = JSON.parse(JSON.stringify(product));
      var productVariant = JSON.parse(JSON.stringify(product));
      productVariant.variation = {};

      if (product.vars.length > 0 && product.sizes.length > 0) {
        if (self.currentSize && self.currentVariation) {
            productVariant.variation.size = self.currentSize;
            productVariant.variation.description = self.currentVariation.description;
            productVariant.variation.image = self.currentVariation.image;
            productVariant.variation.quanitity = self.currentVariation.quanitity;
            productVariant.variation.sku = self.currentVariation.sku;
            add(productVariant);
            openCart();
        } else {
          alert('must have size and style');
        }
      } else if (product.vars.length > 0 && product.sizes.length == 0) {
        if (self.currentVariation) {
            productVariant.variation.description = self.currentVariation.description;
            productVariant.variation.image = self.currentVariation.image;
            productVariant.variation.quanitity = self.currentVariation.quanitity;
            productVariant.variation.sku = self.currentVariation.sku;
            add(productVariant);
            openCart();
        } else {
          alert('must select a style');
        }
      } else if (product.vars.length == 0 && product.sizes.length > 0) {
          if (self.currentSize) {
            productVariant.variation.size = self.currentSize;
            add(productVariant);
            openCart();
        } else {
          alert('must select a size');
        }
      }
      else {
        add(regularProduct);
        openCart();
      }
    }


    const switchImg = function(img) {
      document.getElementById('main-product-image').src=img;
      var single = document.getElementsByClassName('single-prod-image');
      var i = 0;
      for (i = 0; i < single.length; i++) {
        if (single[i].src == img) {
          single[i].classList.add('selected')
        } else {
          if (single[i].classList.contains('selected')) {
             single[i].classList.remove('selected');
          }
        }
      }
    }

    const optionSelect = function(e) {
      var selected = e.target.value;
      product.vars.forEach(function(vari) {
        if (vari.description == selected) {
          switchImg(vari.image);
          self.currentVariation = vari;
        }
      })
    }

    const sizeSelect = function(e) {
      var size = e.target.value;
      self.currentSize = size;
    }

    var images = null;
    var dropDowns = null;
    var sizes = null;
    var descriptions = null;
    var chartImgLink = null;

    if ( product && product.id == this.props.params.itemId ) {

      if (product.vars.length > 1) {
        var images = product.vars.map(function(vari, i) {
            if (i == 0) {
              return (<img className='single-prod-image selected' onClick={switchImg.bind(this, vari.image)} src={vari.image} />)
            } else {
              return (<img className='single-prod-image' onClick={switchImg.bind(this, vari.image)} src={vari.image} />)
            }
        });
        var descriptions = product.vars.map(function(vari, i) {
          if (vari.description) return (<option key={i} value={vari.description}>{vari.description}</option>);
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
        chartImgLink = (<a target='_blank' href={product.sizeChart}>chart</a>);
      }

      if (product.vars.length > 1 && product.sizes.length > 1) {
        var dropDowns = (
          <div>
            <select id="descriptions" onChange={optionSelect.bind(this)}>
              {descriptions}
            </select>
            <select onChange={sizeSelect.bind(this)}>
              {sizes}
            </select>
            {chartImgLink}
          </div>
        );
      } else if (product.vars.length > 1) {
        var dropDowns = (
          <div>
            <select id="descriptions" onChange={optionSelect.bind(this)}>
              {descriptions}
            </select>
          </div>
        );
      } else if (product.sizes.length > 1) {
        var dropDowns = (
          <div>
            <select onChange={sizeSelect.bind(this)}>
              {sizes}
            </select>
            {chartImgLink}
          </div>
        );
      }

      productEl = (

          <section className='productShowcase' key={product.id}>

            <div className="image noselect">
              <img id="main-product-image" src={product.image.main.url} />
            </div>

            <div className="images-select noselect">
              {images}
            </div>

            <div className='info'>

              <section className='left'>
                <h1>{product.title}</h1>
                <div className='description'><p>{product.description}</p></div>
                {dropDowns}
              </section>

              <section className='right'>
                <div className={product.price ? 'price' : 'price no-price'}>
                  <p>{product.price ? '$' : null}{product.price ? product.price.toFixed(2) : 'price available upon request'}</p>
                </div>
                <div className='button-parent'>
                  {product.price ? <button className="noselect" onClick={doubleCart}>Add to Shopping Bag</button> : <a href="mailto:hello@mickalenethomas.com" target="_blank" className="no-price noselect">Contact Us</a>}
                </div>
              </section>

            </div>
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

