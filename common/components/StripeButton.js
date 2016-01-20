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

    onScriptLoaded() {
      var self = this;
      var cart = this.props.state.store.cart;
      var total = 0;
      var skus = [];

      cart.forEach(function(item, i) {
        total += (item.price * item.quantity);
        skus.push({'sku': item.sku, 'quantity': item.quantity});
      });

        // Initialize the Stripe handler on the first onScriptLoaded call.
        // This handler is shared by all StripeButtons on the page.
        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_CZxc4aQDJvojPMDeQflnWvGe',
                image: '/images/m.png',
                billingAddress: true,
                shippingAddress: true,
                token: function(token) {

                  var formData = {
                    stripeToken: token,
                    total: total,
                    skus: skus
                  }
                  console.log('formData', formData)

                  var xmlhttp = new XMLHttpRequest();
                  xmlhttp.open('POST', '/stripe', true);
                  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  xmlhttp.send(JSON.stringify(formData));
                  // Use the token to create the charge with a server-side script.
                }
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    }

    showLoadingDialog() {
        // show a loading dialog
    }

    hideLoadingDialog() {
        // hide the loading dialog
    }

    showStripeDialog() {
      var self = this;
      var total = 0;
      var cart = this.props.state.store.cart;
      cart.forEach(function(item, i) {
        total += (item.price * item.quantity);
      })
      this.hideLoadingDialog();
      StripeButton.stripeHandler.open({
        name: 'Mickalene Thomas',
        description: cart.length > 1 ? cart.length + ' items ($' + total.toFixed(2) + ')' : cart.length + ' item ($' + total.toFixed(2) + ')',
        amount: total*100
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
            <button onClick={clickFunc}>Proceed to Payment</button>
        );
    }
}

reactMixin(StripeButton.prototype, ReactScriptLoaderMixin);
