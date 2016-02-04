import { GET_PRODUCT, ADD_PRODUCT, SET_PRODUCT, QUANTITY, REMOVE } from '../actions/product'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { cart:[], products:null, product:null }

export default function news(state = initialState, action) {
  switch (action.type) {

    case GET_PRODUCT:
    return Object.assign({}, state, {
        products: action.payload.results
      })

    case SET_PRODUCT:
    return Object.assign({}, state, {
        product: action.payload.results
      })

    case ADD_PRODUCT:
      var exists = state.cart.indexOf(action.payload.results);

      if (exists >= 0 ) {
        state.cart.forEach(function(item, i) {
          if (item.id === action.payload.results.id) {
            item.quantity += 1;
          }
        })
      } else {
        state.cart.push(action.payload.results)
      }



    case QUANTITY:
      if (!action.payload.value) {
        state.cart.forEach(function(item, i) {
          if (item.id === action.payload.id) {
            if (item.quantity > 0) {
              item.quantity -= 1;
            }
          }
        })
      } else if (action.payload.value) {
        state.cart.forEach(function(item, i) {
          if (item.id === action.payload.id) {
            item.quantity += 1;
          }
        })
      }
      return Object.assign({}, state, {
          cart: state.cart
      })

    case REMOVE:
      state.cart.forEach(function(item, i) {
        if (item.id === action.payload.id) {
          state.cart.splice(i, 1);
        }
      })
      return Object.assign({}, state, {
          cart: state.cart
      })

    case UPDATE_PATH:

    default:
      return state
  }
}