import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';

export default class Cart extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    console.log(this.props.state.store.cart, 'current cart on cart component')

    var cart = this.props.state.store.cart;
    var cartEl = null;
    var total = 0;
    if (cart) {
      var cartEl = cart.map(function(item, i) {
        return (
          <div key={i} className='cartItem'>
            <section>
              <img src={item.image.small.url} />
            </section>
            <section>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
            </section>
            <section>
              <p>{'$' + item.price.toFixed(2)}</p>
            </section>
            <section>
              <p>quantity</p>
            </section>
          </div>
        );
      });
      cart.forEach(function(item, i) {
          total += item.price;
      })
    }


    return (
      <div className="cart">
        {cartEl}
        <div className='total'>
          <h1>total</h1>
          <p>{'$' + total.toFixed(2)}</p>
        </div>
        <div className='holdButton'>
          <button>proceed to payment</button>
        </div>
      </div>
    )
  }
}

