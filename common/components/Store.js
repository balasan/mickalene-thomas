import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';

export default class Store extends Component {

  componentDidMount() {

  }

  componentDidUpdate() {

  }



  render () {
    console.log(this.props.state.store.cart, 'current cart')

    const { add } = this.props;

    var products = null;

    if (this.props.state.store.products) {
      products = this.props.state.store.products.map(function(product, i) {
        return (
          <section key={i} onClick={add.bind(i, product)} style={{backgroundImage: 'url(' + product.image.small.url + ')'}}></section>
        );
      });
    }


    return (
      <div className="products">
       {products}
      </div>
    )
  }
}

