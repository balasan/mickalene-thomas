export const GET_WORK = 'GET_WORK';
export const GET_ITEM = 'GET_ITEM';
import { fetchWork } from '../api/work'
import { fetchItem } from '../api/work'


export function set(value) {
  return {
    type: GET_WORK,
    payload: value
  };
}

export function setitem(value) {
  return {
    type: GET_ITEM,
    payload: value
  };
}

export function clickitem(id) {
  return dispatch => {
    fetchItem(id,  (err, value) => {
      if (err) return reject
      dispatch(setitem(value))
    })
  }
}

export function loadWork() {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchWork( (err, value) => {
        if (err) return reject
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}