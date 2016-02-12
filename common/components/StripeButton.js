import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
var reactMixin = require('react-mixin');


export default class StripeButton extends Component {

    getScriptURL() {
        return 'https://checkout.stripe.com/checkout.js';
    }

    componentDidMount() {
      this.total = 0;
      this.skus = [];
    }

    componentDidUpdate() {
      this.total = 0;
      this.skus = [];
      this.cartData();
    }

    cartData() {
      var self = this;
      var cart = this.props.state.store.cart;
      cart.forEach(function(item, i) {
        self.total += (item.price * item.quantity);
        self.skus.push({'sku': item.sku, 'quantity': item.quantity});
      });
      if (StripeButton.stripeHandler) {
        this.configureStripe();
      }
    }

    configureStripe() {
      var self = this;

      if (StripeButton.stripeHandler) {
        delete StripeButton.stripeHandler;
        var stripeEls = document.getElementsByClassName('stripe_checkout_app');
        var i = 0;
        for (i = 0; i < stripeEls.length; i++) {
          stripeEls[i].parentNode.removeChild(stripeEls[i]);
        }
      }

      StripeButton.stripeHandler = StripeCheckout.configure({
        key: 'pk_test_CZxc4aQDJvojPMDeQflnWvGe',
        image: '/images/m.png',
        billingAddress: true,
        shippingAddress: true,
        token: function(token) {
          var formData = {
            stripeToken: token,
            total: self.total,
            skus: self.skus
          }
          console.log('formData', formData)

          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open('POST', '/stripe', true);
          xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xmlhttp.send(JSON.stringify(formData));
        }
      });

    }

    onScriptLoaded() {
      var self = this;
      if (!StripeButton.stripeHandler) {
          this.cartData();
          this.configureStripe();
      }
      if (this.hasPendingClick) {
          this.showStripeDialog();
      }
    }

    showLoadingDialog() {
    }

    hideLoadingDialog() {
    }

    showStripeDialog() {
      var self = this;
      // var total = 0;
      var cart = this.props.state.store.cart;
      // cart.forEach(function(item, i) {
      //   total += (item.price * item.quantity);
      // })
      this.hideLoadingDialog();
      StripeButton.stripeHandler.open({
        name: 'Mickalene Thomas',
        description: cart.length > 1 ? cart.length + ' items ($' + self.total.toFixed(2) + ')' : cart.length + ' item ($' + self.total.toFixed(2) + ')',
        amount: self.total*100
      });
    }

    onScriptError() {
        this.hideLoadingDialog();
        StripeButton.scriptDidError = true;
    }

    render() {
      var self = this;

      const clickFunc = function() {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            self.showStripeDialog();

        } else {
            self.showLoadingDialog();
            self.hasPendingClick = true;
        }
      }

        return (
            <button className="noselect" onClick={clickFunc}>Proceed to Payment</button>
        );
    }
}

reactMixin(StripeButton.prototype, ReactScriptLoaderMixin);
