import { GET_PRODUCT, ADD_PRODUCT, SET_PRODUCT, QUANTITY, REMOVE, TOGGLE_CHART } from '../actions/product'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { cart:[], products:null, product:null, showChart:false }

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
      if (action.payload.results.variation) {
        var variation = action.payload.results.variation;
        var description = action.payload.results.variation.description;
        var size = action.payload.results.variation.size;
        var varExists = 0;
        if (state.cart.length > 0) {
          state.cart.forEach(function(item, i) {
            if (item.id === action.payload.results.id) {

              if (size && description) {
                if (size == item.variation.size && description == item.variation.description) {
                  item.quantity += 1;
                  varExists += 1;
                }
              } else if (size) {
                if (size == item.variation.size) {
                  item.quantity += 1;
                  varExists += 1;
                }
              } else if (description) {
                if (description == item.variation.description) {
                  item.quantity += 1;
                  varExists += 1;
                }
              }

            }
            if (i == state.cart.length - 1 && varExists == 0) state.cart.push(action.payload.results);
          });
        } else {
          state.cart.push(action.payload.results);
        }
      } else {
        var exists = state.cart.indexOf(action.payload.results);
        if (exists >= 0) {
            state.cart.forEach(function(item, i) {
              if (item.id === action.payload.results.id) {
                item.quantity += 1;
              }
            })
        } else {
          state.cart.push(action.payload.results)
        }
      }



      return state;



    case QUANTITY:
    console.log(action.payload, 'payload')
      if (action.payload.item.variation) {
          var variation = action.payload.item.variation;
          var description = action.payload.item.variation.description;
          var size = action.payload.item.variation.size;
      }
      if (!action.payload.value) {
        state.cart.forEach(function(itemX, i) {
          if (itemX.id === action.payload.item.id) {

            if (itemX.quantity > 0) {


              if (size && description) {
                if (size == itemX.variation.size && description == itemX.variation.description) {
                   itemX.quantity -= 1;
                }
              } else if (size) {
                if (size == itemX.variation.size) {
                   itemX.quantity -= 1;
                }
              } else if (description) {
                if (description == itemX.variation.description) {
                   itemX.quantity -= 1;
                }
              } else {
                itemX.quantity -= 1;
              }

            }

          }
        })
      } else if (action.payload.value) {
        state.cart.forEach(function(itemX, i) {
          if (itemX.id === action.payload.item.id) {
            if (size && description) {
                if (size == itemX.variation.size && description == itemX.variation.description) {
                   itemX.quantity += 1;
                }
              } else if (size) {
                if (size == itemX.variation.size) {
                   itemX.quantity += 1;
                }
              } else if (description) {
                if (description == itemX.variation.description) {
                   itemX.quantity += 1;
                }
              } else {
                itemX.quantity += 1;
              }


          }
        })
      }
      return Object.assign({}, state, {
          cart: state.cart
      })

    case REMOVE:
      state.cart.forEach(function(item, i) {
        if (item.id === action.payload.id) {
          item.quantity = 1;
          state.cart.splice(i, 1);
        }
      })
      return Object.assign({}, state, {
          cart: state.cart
      })

    case TOGGLE_CHART:
      return Object.assign({}, state, {
        showChart: !state.showChart
      })

    case UPDATE_PATH:
      return state

    default:
      return state
  }
}