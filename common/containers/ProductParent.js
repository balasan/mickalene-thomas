import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Product from '../components/Product';
import * as ProductActions from '../actions/product';
import Cart from '../components/Cart';

if(process.env.BROWSER){
  require('./../../client/css/product.css');
}

export default class ProductParent extends Component {

  static fetchProductData(dispatch, params) {
    var id = params.itemId
    var { loadProduct } = bindActionCreators(ProductActions, dispatch, id)
    return Promise.all([
      loadProduct(id)
    ])
  }

  componentDidMount() {
    this.constructor.fetchProductData(this.props.dispatch, this.props.params);
  }

  render () {
    return (
      <div>
        <Product { ...this.props } />
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
