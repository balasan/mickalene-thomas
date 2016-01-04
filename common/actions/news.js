export const GET_NEWS = 'GET_NEWS';
export const GET_INSTA = 'GET_INSTA';
import { fetchNews } from '../api/news'
import { fetchInsta } from '../api/insta'

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

export function setInsta(value) {
  return {
    type: GET_INSTA,
    payload: {
      results: value
    }
  };
}

export function loadInsta() {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchInsta( (err, value) => {
        if (err) return reject
        dispatch(setInsta(value))
        resolve(value)
      })
    });
  }
}