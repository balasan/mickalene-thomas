import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';
import StripeButton from '../components/StripeButton';

export default class Cart extends Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {

    const { changeQuantity, removeItem } = this.props;
    var cart = this.props.state.store.cart;
    var cartHash = this.props.location.hash == '#cart';

    const toggleCart = function() {
      var cartHashCtx = window.location.hash == '#cart';
      if (!cartHashCtx)
        window.location.hash = '#cart';
      else
        window.location.hash = '';
    }

    var cartEl = null;
    var total = 0;
    if (cart) {
      if (cart.length > 0) {
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
            <section className="remove-section">
              <img onClick={removeItem.bind(this, item.id)} src="../../images/remove.svg" className='remove' />
            </section>
            <section className='price'>
              <p>{'$' + (item.price * item.quantity).toFixed(2)}</p>
            </section>
            <section className='quantity'>
              <button onClick={changeQuantity.bind(this, item.id, false)}>-</button>
              <p>{item.quantity}</p>
              <button onClick={changeQuantity.bind(this, item.id, true)}>+</button>
              <img onClick={removeItem.bind(this, item.id)} src="../../images/remove.svg" className='remove' />
            </section>
          </div>
        );
      });
      cart.forEach(function(item, i) {
          total += (item.price * item.quantity);
      })
      } else {
        var cartEl = (<div className="empty"><h1>cart is empty</h1></div>);
      }

    }


    return (
      <div className={cartHash ? 'cart' : 'cart hidden'}>
        <a onClick={toggleCart} className="close-cart">
        </a>
        <div className={cart.length > 0 ? 'cart-items' : 'cart-items max-height'}>
        {cartEl}
        </div>
        <div className={cart.length > 0 ? 'total' : 'total hidden'}>
          <h1>total</h1>
          <p>{'$' + total.toFixed(2)}</p>
          <div className='holdButton'>
          {cart.length > 0 ? <StripeButton { ...this.props }/> : null}
          </div>
        </div>
      </div>
    )
  }
}

