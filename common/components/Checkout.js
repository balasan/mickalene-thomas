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
      email: null,
      customer: null,
      firstemail: null
    }
  }

  getScriptURL() {
    return 'https://js.stripe.com/v2/';
  }

  onScriptLoaded() {
    console.log('loaded')
    //if (!PaymentForm.getStripeToken) {
      // Put your publishable key here
      Stripe.setPublishableKey('pk_test_CZxc4aQDJvojPMDeQflnWvGe');

      this.setState({ stripeLoading: false, stripeLoadingError: false });
    // }
  }

  onScriptError() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  }

  onSubmit(event) {
    var self = this;
    event.preventDefault();
    var amount = self.props.state.store.order.amount / 100;
    this.setState({ submitDisabled: true, paymentError: null });

    Stripe.createToken(event.target, function(status, response) {
      if (response.error) {
        self.setState({ paymentError: response.error.message, submitDisabled: false });
        console.log(response, 'error')
      } else {
        self.setState({ paymentComplete: true, submitDisabled: false, token: response.id });
        console.log(response.id, 'token');

        // var xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = function() {
        //   if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        //     console.log('charged');
        //     console.log(xmlhttp.responseText);
        //   }
        // }
        // xmlhttp.open('POST', '/charge', true);
        // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // xmlhttp.send(JSON.stringify({token: response.id, customer: self.state.customer, email: self.state.email, amount: amount}));
      }
    });
  }

  createCustomer() {
    var self = this;
    var customerData = {
      email: self.state.firstemail,
    }
    console.log('formData createCustomer', customerData)
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        var responseData = xmlhttp.responseText;
        var customerJson = JSON.parse(responseData);
        self.setState({customer: customerJson.id});
        console.log(self, )
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

  createOrder() {
    var self = this;
    var cart = this.props.state.store.cart;

    // key: 'pk_test_CZxc4aQDJvojPMDeQflnWvGe'
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
        //console.log(xmlhttp.responseText, 'response');
        var responseData = xmlhttp.responseText;
        var orderJson = JSON.parse(responseData);
        self.setState({order: orderJson});
        console.log(ProductActions, 'ProductActions');
        self.props.setOrder(orderJson);
        console.log(self, 'create order')
      }
    }
    xmlhttp.open('POST', '/createOrder', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(formData));
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
    // else if (this.state.paymentComplete) {
      customerEl = (<div><input style={{color: 'black'}} type="text"  onChange={(firstemail) => this.setState({firstemail: firstemail.target.value})} value={this.state.firstemail} placeholder="firstemail" /><h1 onClick={self.createCustomer.bind(self)} style={{color: 'black'}}>submit</h1></div>);

      message = 'customer created';

      shippingEl = (
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <input style={{color: 'black'}} type="text"  onChange={(shippingName) => this.setState({shippingName: shippingName.target.value})} value={this.state.shippingName} placeholder="Name" />
        <input style={{color: 'black'}} type="text"  onChange={(add1) => this.setState({add1: add1.target.value})} value={this.state.add1} placeholder="Address line 1" />
        <input style={{color: 'black'}} type="text"  onChange={(add2) => this.setState({add2: add2.target.value})} value={this.state.add2} placeholder="Address line 2" />
        <input style={{color: 'black'}} type="text"  onChange={(city) => this.setState({city: city.target.value})} value={this.state.city} placeholder="City" />
        <input style={{color: 'black'}} type="text"  onChange={(country) => this.setState({country: country.target.value})} value={this.state.country} placeholder="Country" />
        <input style={{color: 'black'}} type="text"  onChange={(zip) => this.setState({zip: zip.target.value})} value={this.state.zip} placeholder="Zip" />
        <button class="noselect"  onClick={self.createOrder.bind(self)}>Continue</button>
        </div>)
    // }

      inputEl = (<form onSubmit={this.onSubmit.bind(self)} >
        <span className="error">{ this.state.paymentError }</span><br />
        <input type="text" data-stripe='email' onChange={(email) => this.setState({email: email.target.value})} value={this.state.email} placeholder="email" /><br/>
        <input id="cc-num" className="cc-num" type='text' data-stripe='number'  autoComplete="cc-number" placeholder="Credit card number" required /><br />
        <input id="cc-exp" className="cc-exp" type='text' data-stripe='exp' autoComplete="cc-exp" placeholder="Expiration" required/><br />
        <input id="cc-cvc" className="cc-cvc" type='text' data-stripe='cvc' autoComplete="off" placeholder="CVC" required/><br />
        <input id="cc-zip" className="cc-zip" type='text' data-stripe='address_zip' autoComplete="off" placeholder="Billing zipcode" required/><br />
        <button class="noselect" disabled={this.state.submitDisabled} type='submit' value='Purchase'>Submit</button>
      </form>);


    return (
      <div className="checkout">
        <h2>Payment details</h2>
        {!self.state.customer ? customerEl : null}
        {self.state.order ? inputEl : null}
        {self.state.customer && !self.state.order ? shippingEl : null}
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
