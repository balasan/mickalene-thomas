export const GET_WORK = 'GET_WORK';
export const GET_WORK_ITEM = 'GET_WORK_ITEM';
import { fetchWork, fetchItem } from '../api/work'


export function set(value, filter) {
  return {
    type: GET_WORK,
    payload: {
      results: value,
      filter: filter
    }
  };
}

export function setWorkItem(value) {
  return {
    type: GET_WORK_ITEM,
    payload: value
  };
}

export function loadWorkItem(id) {
  console.log("load work action")
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchItem(id,  (err, value) => {
        if (err) return reject
        dispatch(setWorkItem(value))
        resolve(value);
      })
    });
  }
}

export function loadWork(filter) {
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