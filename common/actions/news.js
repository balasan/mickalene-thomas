export const GET_NEWS = 'GET_NEWS';
import { fetchNews } from '../api/news'

export function set(value) {
  return {
    type: GET_NEWS,
    payload: {
      results: value
    }
  };
}

export function loadNews() {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchNews( (err, value) => {
        if (err) return reject
        dispatch(set(value))
        resolve(value)
      })
    });
  }
}