import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Store from '../components/Store';
import * as ProductActions from '../actions/product';
import Cart from '../components/Cart';

if(process.env.BROWSER){
  require('./../../client/css/store.css');
  require('./../../client/css/index.css');
}

export default class StoreParent extends Component {

  static fetchProductDataOnClient(dispatch) {
    var { loadProducts } = bindActionCreators(ProductActions, dispatch)
    return Promise.all([
      loadProducts()
    ])
  }

  componentDidMount() {
    if (!this.props.state.product) this.constructor.fetchProductDataOnClient(this.props.dispatch);
  }

  render () {
    return (
      <div>
        <Store { ...this.props }/>
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
  })(StoreParent)
