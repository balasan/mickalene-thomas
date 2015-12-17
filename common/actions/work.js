export const GET_WORK = 'GET_WORK';
export const GET_ITEM = 'GET_ITEM';
export const GET_NEW = 'GET_NEW';
export const SET_FLEX = 'SET_FLEX';
import { fetchWork } from '../api/work'
import { fetchItem } from '../api/work'


export function set(value, filter) {
  return {
    type: GET_WORK,
    payload: {
      results: value,
      filter: filter
    }
  };
}

export function setFlex(value) {
  return {
    type: SET_FLEX,
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

export function loadItem(id) {
  return dispatch => {
    fetchItem(id,  (err, value) => {
      if (err) return reject
      dispatch(setitem(value))
    })
  }
}

export function loadWork(filter) {
  // console.log(filter, 'loadwork filter')
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchWork( (err, value) => {
        if (err) return reject
        dispatch(set(value, filter))
        resolve(value)
      })
    });
  }
}