export const GET_WORK = 'GET_WORK';
import { fetchWork } from '../api/work'


export function set(value) {
  return {
    type: GET_WORK,
    payload: value
  };
}

export function loadWork() {
  return dispatch => {
    // return Promise(fetchCounter(dispatch(set)))
    return new Promise(function(resolve, reject) {
      fetchWork( (err, value) => {
        if (err) return reject
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}