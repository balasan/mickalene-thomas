import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Product from '../components/Product';
import * as ProductActions from '../actions/product';
import Cart from '../components/Cart';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if(process.env.BROWSER){
  require('./../../client/css/product.css');
}

export default class ProductParent extends Component {

  static fetchProductData(dispatch, params) {
    var id = params.itemId
    console.log("fetching product", id)
    var { loadProduct } = bindActionCreators(ProductActions, dispatch, id)
    return Promise.all([
      loadProduct(id)
    ])
  }

  componentDidMount() {
    console.log(this.props.params, 'product params')
    this.constructor.fetchProductData(this.props.dispatch, this.props.params);
  }

  render () {
    return (
      <div>
      <ReactCSSTransitionGroup
        transitionName="single"
        transitionAppear={true}
        transitionAppearTimeout={700}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={600}>
        <div key={this.props.params.id}>
          <Product { ...this.props } />
        </div>
      </ReactCSSTransitionGroup>
        <Cart { ...this.props } />
      </div>
      )
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(ProductActions, dispatch))
  })(ProductParent)
