export const GET_PRODUCT = 'GET_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
import { fetchProduct } from '../api/product'

export function set(value) {
  return {
    type: GET_PRODUCT,
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

export function loadProduct () {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchProduct( (err, value) => {
        if (err) return reject
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}