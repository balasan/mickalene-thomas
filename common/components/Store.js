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
        var divStyle = {
          backgroundImage: 'url(' + product.images[0] + ')'
        };
        return (
          <Link to={'/store/' + product.id} key={product.images[0]}>
            <div style={divStyle}></div>
            <p>{product.title}</p>
          </Link>
        );
      });
    }


    return (
      <div className="products noselect">
      <div className='inner'>
       {products}
       </div>
      </div>
    )
  }
}
