export const GET_PRODUCT = 'GET_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';
export const TOGGLE_CHART = 'TOGGLE_CHART';
export const QUANTITY = 'QUANTITY';
export const REMOVE = 'REMOVE';
import { fetchProducts, fetchProduct } from '../api/product'

export function set(value) {
  return {
    type: GET_PRODUCT,
    payload: {
      results: value
    }
  };
}

export function togglePayment() {
  return {
    type: 'TOGGLE_PAYMENT'
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