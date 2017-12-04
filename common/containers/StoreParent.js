import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Store from '../components/Store';
import * as ProductActions from '../actions/product';
import Cart from '../components/Cart';
import Work from '../components/Work';
import * as MenuActions from '../actions/menu';

import ProductParent from './ProductParent';

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
    if (!this.props.storeProp.products) this.constructor.fetchProductDataOnClient(this.props.dispatch);
  }

  render () {
    let product;
    if (this.props.params.itemId) {
      product = <div className={'workItemContainer ' + (this.props.params.itemId ? '' : 'hidden')}>

        <ProductParent {...this.props}/>
      </div>;
    }
    return (
      <div className="container3d">
        <div className={'worksContainer ' + (this.props.params.itemId ? 'hidden' : '') }>
          <Store { ...this.props }/>
        </div>
        {product}
      </div>
    )
  }
}

export default connect(
  state => {
    return {storeProp: state.store, menu: state.menu}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(Object.assign({}, ProductActions, MenuActions), dispatch))
  })(StoreParent)
