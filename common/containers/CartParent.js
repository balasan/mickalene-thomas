import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Cart from '../components/Cart';
import StripeButton from '../components/StripeButton';
import * as ProductActions from '../actions/product'

if(process.env.BROWSER){
  require('./../../client/css/cart.css');
}

export default class CartParent extends Component {

  componentDidMount() {
  }

  render () {

    return (
      <div>
       <Cart { ...this.props }/>
       <StripeButton { ...this.props }/>
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
  })(CartParent)
