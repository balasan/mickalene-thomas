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
    const { add } = this.props;
    if ( this.props.state.store.product ) {
      var product = this.props.state.store.product;
      productEl = (
        <section className='productShowcase'>
            <ReactCSSTransitionGroup
              transitionName="single"
              transitionAppear={true}
              transitionAppearTimeout={0}
              transitionEnterTimeout={0}
              transitionLeaveTimeout={0}>
              <div className="image">
                <img src={product.image.main.url} />
              </div>
           </ReactCSSTransitionGroup>
           <div className='info'>

           <section className='top'>
             <h1>{product.title}</h1>
             <p className='price'>{product.price ? '$' : null}{product.price ? product.price.toFixed(2) : 'price available upon request'}</p>
           </section>

           <section className='bottom'>
           <div className='description'><p>{product.description}</p></div>
            {product.price ? <button onClick={add.bind(this, product)}>Add to Shopping Bag</button> : <a href="mailto:hello@mickalenethomas.com" target="_blank" className="no-price">contact us</a>}
           </section>
            </div>
        </section>
      )
    }


    return (
      <div>
        {productEl}
      </div>
    )
  }
}

