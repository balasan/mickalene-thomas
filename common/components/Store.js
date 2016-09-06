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
    var firstImg = null;

    if (this.props.state.store.products) {
      products = this.props.state.store.products.map(function(product, i) {
      console.log(product, 'product')
      if (typeof product.images[0] == 'string') {
        firstImg = product.images[0];
      } else {
        firstImg = product.images[0].image;
      }


        var divStyle = {
          backgroundImage: 'url(' + firstImg + ')'
        };
        return (
          <Link to={'/store/' + product.id} key={i}>
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
