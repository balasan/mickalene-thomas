export const TOGGLE = 'TOGGLE';
export const TOGGLE_LINKS = 'TOGGLE_LINKS';
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const GET_MENU = 'GET_MENU';
export const SET_FILTER = 'SET_FILTER';
import { fetchMenu } from '../api/menu'

export function toggle() {
  console.log("toggle")
  return {
    type: TOGGLE
  };
}

export function toggleLinks() {
  console.log("toggleLinks")
  return {
    type: TOGGLE_LINKS
  };
}

export function toggleNav() {
  console.log("toggleNav")
  return {
    type: TOGGLE_NAV
  };
}


export function set(value, length) {
  return {
    type: GET_MENU,
    payload: value,
    length: length
  };
}



export function loadMenu(length) {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchMenu(value => {
        dispatch(set(value, length))
        resolve(value)
      })
    });
  }
}
