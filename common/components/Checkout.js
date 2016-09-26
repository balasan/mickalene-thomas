import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { updatePath } from 'redux-simple-router';
import * as ProductActions from '../actions/product';
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
var reactMixin = require('react-mixin');

export default class Checkout extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      stripeLoading: true,
      stripeLoadingError: false,
      submitDisabled: false,
      paymentError: null,
      paymentComplete: false,
      token: null,
      customer: null,
      email: null,
      success: false
    }
  }

  getScriptURL() {
    return 'https://js.stripe.com/v2/';
  }

  onScriptLoaded() {
    Stripe.setPublishableKey('pk_test_CZxc4aQDJvojPMDeQflnWvGe');
    this.setState({ stripeLoading: false, stripeLoadingError: false });
  }

  onScriptError() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  }

  onSubmit(event) {
    var self = this;
    event.preventDefault();
    this.setState({ submitDisabled: true, paymentError: null });

    Stripe.createToken(event.target, function(status, response) {
      if (response.error) {
        self.setState({ paymentError: response.error.message, submitDisabled: false });
        console.log(response, 'error')
      } else {
        self.setState({ paymentComplete: true, submitDisabled: false, token: response.id });
        if (response.id) self.chargeMe();
      }
    });
  }

  createCustomer() {
    var self = this;
    var customerData = {
      email: self.state.email,
    }
    console.log('formData createCustomer', customerData)
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        var responseData = xmlhttp.responseText;
        var customerJson = JSON.parse(responseData);
        self.setState({customer: customerJson.id});
        self.createOrder();
      }
    }
    xmlhttp.open('POST', '/createCustomer', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(customerData));
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    $('.cc-num').payment('formatCardNumber');
    $('.cc-exp').payment('formatCardExpiry');
    $('.cc-cvc').payment('formatCardCVC');
    this.cartData();
  }

  cartData() {
    var self = this;
    this.total = 0;
    var cart = this.props.state.store.cart;
    cart.forEach(function(item, i) {
      self.total += (item.price * item.quantity);
    });
  }

  initOrder(event) {
    event.preventDefault();
    var self = this;
    self.createCustomer();
  }

  createOrder() {
    var self = this;
    var cart = this.props.state.store.cart;
    var formData = {
      cart: cart,
      token: self.state.token,
      customer: self.state.customer,
      name: self.state.shippingName,
      add1: self.state.add1,
      add2: self.state.add2,
      city: self.state.city,
      country: self.state.country,
      zip: self.state.zip
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        var responseData = xmlhttp.responseText;
        var orderJson = JSON.parse(responseData);
        self.setState({order: orderJson});
        self.props.setOrder(orderJson);
      }
    }
    xmlhttp.open('POST', '/createOrder', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(formData));
  }

  chargeMe() {
    var self = this;
    var amount = self.props.state.store.order.amount;
    var chargeObj = {token: self.state.token, customer: self.state.customer, email: self.state.email, amount: amount};
    console.log(chargeObj, 'chargeObj')
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        console.log('charged');
        self.props.togglePayment();
      }
    }
    xmlhttp.open('POST', '/charge', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(chargeObj));
  }

  cancelOrder() {
    var self = this;
    self.setState({order: null, token: null, customer: null, email: null});
    self.props.togglePayment();
     self.props.setOrder(null);
  }


  render () {
    var self = this;
    var inputEl = null;
    var message = null;
    var shippingEl = null;
    var customerEl = null;

    if (this.state.stripeLoading) {
      message = 'Loading';
    }
    else if (this.state.stripeLoadingError) {
      message = 'Error';
    }

      customerEl = (<div><h1 onClick={self.createCustomer.bind(self)} style={{color: 'black'}}>submit</h1></div>);

      shippingEl = (
        <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={self.initOrder.bind(self)}>
          <span className="error">{ this.state.paymentError }</span><br />
          <input style={{color: 'black'}} type="text"  onChange={(email) => this.setState({email: email.target.value})} value={this.state.email} placeholder="email" required/>
          <input style={{color: 'black'}} type="text"  onChange={(shippingName) => this.setState({shippingName: shippingName.target.value})} value={this.state.shippingName} placeholder="Shipping Name" required/>
          <input style={{color: 'black'}} type="text"  onChange={(add1) => this.setState({add1: add1.target.value})} value={this.state.add1} placeholder="Address line 1" required/>
          <input style={{color: 'black'}} type="text"  onChange={(add2) => this.setState({add2: add2.target.value})} value={this.state.add2} placeholder="Address line 2" />
          <input style={{color: 'black'}} type="text"  onChange={(city) => this.setState({city: city.target.value})} value={this.state.city} placeholder="City" required/>
          <input style={{color: 'black'}} type="text"  onChange={(country) => this.setState({country: country.target.value})} value={this.state.country} placeholder="Country" required/>
          <input style={{color: 'black'}} type="text"  onChange={(zip) => this.setState({zip: zip.target.value})} value={this.state.zip} placeholder="Zip" required/>
          <button className="noselect" type="submit">Continue</button>
        </form>)

      inputEl = (<form onSubmit={this.onSubmit.bind(self)} >
        <span className="error">{ this.state.paymentError }</span><br />
        <input id="cc-num" className="cc-num" type='text' data-stripe='number'  autoComplete="cc-number" placeholder="Credit card number" required /><br />
        <input id="cc-exp" className="cc-exp" type='text' data-stripe='exp' autoComplete="cc-exp" placeholder="Expiration" required/><br />
        <input id="cc-cvc" className="cc-cvc" type='text' data-stripe='cvc' autoComplete="off" placeholder="CVC" required/><br />
        <input id="cc-zip" className="cc-zip" type='text' data-stripe='address_zip' autoComplete="off" placeholder="Billing zipcode" required/><br />
        <button className="noselect" disabled={this.state.submitDisabled} type='submit' value='Purchase'>Submit</button>
      </form>);


    return (
      <div className="checkout">
        <h2>Payment details</h2>
        {!self.state.order ? shippingEl : inputEl}
        <h3 onClick={self.cancelOrder.bind(self)}>cancel</h3>
      </div>
    )
  }
}

// export default connect(
//   state => {
//     return {state: state}
//   },
//   dispatch => {
//     return Object.assign({}, { dispatch },  bindActionCreators(ProductActions, dispatch))
//   })(Checkout)

reactMixin(Checkout.prototype, ReactScriptLoaderMixin);
