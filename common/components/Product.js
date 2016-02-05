import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ProductActions from '../actions/product'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { updatePath } from 'redux-simple-router';

export default class Product extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    var productEl = null;
    var product = this.props.state.store.product;
    const { add } = this.props;

    const openCart = function() {
        window.location.hash = '#cart';
    }

    const doubleCart = function(product) {
      add(product);
      openCart();
    }


    const switchImg = function(img) {
      console.log(img);
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

    var images = null;

    if ( product && product.id == this.props.params.itemId ) {

      if (product.image.length > 1) {
        var images = product.image.map(function(image, i) {
            if (i == 0) {
              return (<img className='single-prod-image selected' onClick={switchImg.bind(this, image)} src={image} />)
            } else {
              return (<img className='single-prod-image' onClick={switchImg.bind(this, image)} src={image} />)
            }
        });
      }

      productEl = (

          <section className='productShowcase' key={product.id}>
              <div className="image" >
                <img id="main-product-image" src={product.image[0]} />
              </div>
              <div className="images-select">
              {images}
              </div>

           <div className='info'>

           <section className='top'>
             <h1>{product.title}</h1>
             <p className={product.price ? 'price' : 'price no-price'}>{product.price ? '$' : null}{product.price ? product.price.toFixed(2) : 'price available upon request'}</p>
           </section>

           <section className='bottom'>
           <div className='description'><p>{product.description}</p></div>
           <div className='button-parent'>
            {product.price ? <button onClick={doubleCart.bind(this, product)}>Add to Shopping Bag</button> : <a href="mailto:hello@mickalenethomas.com" target="_blank" className="no-price">Contact Us</a>}
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

