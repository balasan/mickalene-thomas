export const TOGGLE = 'TOGGLE';
export const GET_MENU = 'GET_MENU';

import { fetchMenu } from '../api/menu'

export function toggle() {
  console.log("toggle")
  return {
    type: TOGGLE
  };
}


export function set(value) {
  // console.log(value, "set value")
  return {
    type: GET_MENU,
    payload: value
  };
}


export function loadMenu() {
  return dispatch => {
    // return Promise(fetchCounter(dispatch(set)))
    return new Promise(function(resolve, reject) {
      fetchMenu( value => {
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}