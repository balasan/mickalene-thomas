import { GET_PRODUCT} from '../actions/product'
import { ADD_PRODUCT} from '../actions/product'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { cart:[], products:null }

export default function news(state = initialState, action) {
  switch (action.type) {

    case GET_PRODUCT:
    return Object.assign({}, state, {
        products: action.payload.results
      })

    case ADD_PRODUCT:
    state.cart.push(action.payload.results)
    return Object.assign({}, state, {
        cart: state.cart
      })

    case UPDATE_PATH:

    default:
      return state
  }
}