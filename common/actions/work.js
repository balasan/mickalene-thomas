export const GET_WORK = 'GET_WORK';
export const GET_ITEM = 'GET_ITEM';
import { fetchWork } from '../api/work'
import { fetchItem } from '../api/work'


export function set(value) {
  // console.log(value, "set value")
  return {
    type: GET_WORK,
    payload: value
  };
}

export function setitem(value) {
  console.log("works", value)
  return {
    type: GET_ITEM,
    payload: value
  };
}

export function loadItem() {
  return dispatch => {
    // return Promise(fetchCounter(dispatch(set)))
    return new Promise(function(resolve, reject) {
      fetchItem( (err, value) => {
        if (err) return reject
        // console.log(value, "value")
        dispatch(setitem(value))
        resolve(value)
      })
    });
  }
}


export function loadWork() {
  return dispatch => {
    // return Promise(fetchCounter(dispatch(set)))
    return new Promise(function(resolve, reject) {
      fetchWork( (err, value) => {
        if (err) return reject
        // console.log(value, "value")
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}