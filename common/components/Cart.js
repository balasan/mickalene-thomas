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
    const { changeQuantity } = this.props;
    var cart = this.props.state.store.cart;
    console.log(cart, 'cart')
    var cartEl = null;
    var total = 0;
    if (cart) {
      var cartEl = cart.map(function(item, i) {
        return (
          <div key={i} className='cartItem'>
            <section className='image'>
              <img src={item.image.small.url} />
            </section>
            <section className='description'>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
            </section>
            <section className='price'>
              <p>{'$' + (item.price * item.quantity).toFixed(2)}</p>
            </section>
            <section className='quantity'>
              <button onClick={changeQuantity.bind(this, item.id, false)}>-</button>
              <p>{item.quantity}</p>
              <button onClick={changeQuantity.bind(this, item.id, true)}>+</button>
            </section>
          </div>
        );
      });
      cart.forEach(function(item, i) {
          total += (item.price * item.quantity);
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
        </div>
      </div>
    )
  }
}

