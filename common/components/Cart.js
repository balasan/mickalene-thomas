import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
import { updatePath } from 'redux-simple-router';
import StripeButton from '../components/StripeButton';
import Checkout from '../components/Checkout';
import * as ProductActions from '../actions/product';


class Cart extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      payment: false,
      stripeLoading: true,
      stripeLoadingError: false,
      submitDisabled: false,
      paymentError: null,
      paymentComplete: false,
      token: null
    }
  }

  getScriptURL() {
    return 'https://checkout.stripe.com/checkout.js';
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  togglePayment() {
    var self = this;
    self.props.togglePayment();
  }

  render () {
    var self = this;
    const { changeQuantity, removeItem } = this.props;

    var cart = [];
    if (this.props.state) var cart = this.props.state.store.cart;
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

        var variationDescription = null;
        var variationImage = null;

        if (item.variation) {
          if (item.variation.size && item.variation.description) {
             variationDescription = (<p>{item.variation.description+' size: '+item.variation.size}</p>);
          } else if (item.variation.size) {
            variationDescription = (<p>{' size: '+item.variation.size}</p>);
          } else if (item.variation.description) {
            variationDescription = (<p>{item.variation.description}</p>);
          }
          if (item.variation.image) {
            variationImage = (<img src={item.variation.image} />);
          } else {
            variationImage = (<img src={item.images[0]} />);
          }
        } else {
          variationImage = (<img src={item.images[0]} />);
        }

        return (
          <div key={i} className='cartItem'>
            <section className='image noselect'>
              {variationImage}
            </section>
            <section className='description'>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              {variationDescription}
            </section>
            <section className='price'>
              <p>{'$' + (item.price * item.quantity).toFixed(2)}</p>
            </section>
            <section className='quantity noselect'>
            <div>
              <button onClick={changeQuantity.bind(this, item, false)}>-</button>
              <p>{item.quantity}</p>
              <button onClick={changeQuantity.bind(this, item, true)}>+</button>
              </div>
              <p onClick={removeItem.bind(this, item.id)} className='remove'>remove</p>
            </section>
          </div>
        );
      });

var totalEl = null;

      if (!self.props.state.store.order) {
        cart.forEach(function(item, i) {
            total += (item.price * item.quantity);
        })
        var totalEl = (<div><p>{'$' + total.toFixed(2)}</p></div>)
      } else {
        total = 'modified';
        totalEl = self.props.state.store.order.items.map(function(item, i) {
          return (<div key={i}><p>{(item.amount/100) + ' -- ' + item.description}</p></div>);
        })
      }


      } else {
        var cartEl = (<div className="empty"><h1>cart is empty</h1></div>);
      }

    }

    var cartSection = (<div><div className={cart.length > 0 ? 'cart-items' : 'cart-items max-height'}>
        {cartEl}
        </div>
        <div className={cart.length > 0 ? 'total' : 'total hidden'}>
          <h1>total</h1>
          {totalEl}
          <div className='holdButton'>
            {cart.length > 0 ? <p style={{cursor: 'pointer'}} onClick={self.togglePayment.bind(self)}>proceed to payment</p> : null}
          </div>
        </div></div>)


    return (
      <div className={cartHash ? 'cart' : 'cart hidden'}>
        <a onClick={toggleCart} className="close-cart"></a>
        {cartSection}
        {self.props.state.store.showPayment ? <Checkout {...self.props }/> : null}
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
  })(Cart)


