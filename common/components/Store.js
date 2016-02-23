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

    const { add } = this.props;

    var products = null;

    if (this.props.state.store.products) {
      products = this.props.state.store.products.map(function(product, i) {
        // console.log(product, 'product')
        return (
          <Link to={'/store/' + product.id} key={product.image.small.url}>
            <img src={product.image.small.url} />
          </Link>
        );
      });
    }


    return (
      <div className="products noselect">
       {products}
      </div>
    )
  }
}

