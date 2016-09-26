export const GET_PRODUCT = 'GET_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';
export const TOGGLE_CHART = 'TOGGLE_CHART';
export const QUANTITY = 'QUANTITY';
export const REMOVE = 'REMOVE';
export const SET_ORDER = 'SET_ORDER';
import { fetchProducts, fetchProduct } from '../api/product'

export function set(value) {
  return {
    type: GET_PRODUCT,
    payload: {
      results: value
    }
  };
}

export function setOrder(value) {
  console.log('set order', value);
  return {
    type: SET_ORDER,
    payload: value
  };
}

export function togglePayment() {
  return {
    type: 'TOGGLE_PAYMENT'
  };
}

export function completeOrder(bool) {
  return {
    type: 'COMPLETE_ORDER',
    payload: bool
  };
}

export function emptyCart() {
  return {
    type: 'EMPTY_CART'
  };
}

export function changeQuantity(item, value) {
  console.log('quantity action', item, value)
  return {
    type: QUANTITY,
    payload: {
      item: item,
      value: value
    }
  };
}

export function removeItem(id) {
  console.log('remove item', id)
  return {
    type: REMOVE,
    payload: {
      id: id
    }
  };
}

export function setProduct(value) {
  // console.log('single product', value)
  return {
    type: SET_PRODUCT,
    payload: {
      results: value
    }
  };
}

export function add(value) {
  return {
    type: ADD_PRODUCT,
    payload: {
      results: value
    }
  };
}

export function loadProducts () {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchProducts( (err, value) => {
        if (err) return reject
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}

export function toggleChart() {
  console.log('toggle')
  return {
    type: TOGGLE_CHART
  };
}

// export function loadProduct () {
//   return dispatch => {
//     return new Promise(function(resolve, reject) {
//       fetchProduct( (err, value) => {
//         if (err) return reject
//         dispatch(setProduct(value))
//         resolve(value)
//       })
//     });
//   }
// }


export function loadProduct(id) {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchProduct(id,  (err, value) => {
        if (err) return reject
        dispatch(setProduct(value))
        resolve(value);
      })
    });
  }
}