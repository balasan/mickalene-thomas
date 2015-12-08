export const TOGGLE = 'TOGGLE';
export const GET_MENU = 'GET_MENU';
export const SET_FILTER = 'SET_FILTER';
import { fetchMenu } from '../api/menu'

export function toggle() {
  console.log("toggle")
  return {
    type: TOGGLE
  };
}

export function set(value) {
  return {
    type: GET_MENU,
    payload: value
  };
}

export function initFilter(filter, i) {
  return {
    type: SET_FILTER,
    payload: filter
  }
}

export function loadMenu() {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchMenu( value => {
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}