export const GET_WORK = 'GET_WORK';
export const GET_WORK_ITEM = 'GET_WORK_ITEM';
export const GET_NEWS = 'GET_NEWS';
export const GET_INSTA = 'GET_INSTA';
import { fetchWork, fetchItem, fetchExhibition } from '../api/work'
import { fetchNews } from '../api/news'
import { fetchInsta } from '../api/insta'


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

export function clearItem() {
  return {
    type: GET_WORK_ITEM,
    payload: null
  }
}

export function clearExhibition() {
  return {
    type:'CLEAR_EXHIBITION'
  }
}

export function loadWorkItem(id) {
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

export function loadExhibition(id) {
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchExhibition(id, (err, value) => {
        if (err) return reject
        dispatch(setExhibition(value))
        resolve(value)
      })
    });
  }
}

export function setNews(value) {
  return {
    type: GET_NEWS,
    payload: {
      results: value
    }
  };
}

export function setExhibition(value) {
  return {
    type: 'SET_EXHIBITION',
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
        dispatch(setNews(value))
        resolve(value)
      })
    });
  }
}

export function setInsta(value) {
  return {
    type: GET_INSTA,
    payload: {
      results: value.body.data.data,
      next: value.body.next
    }
  };
}

export function loadInsta(nextUrl) {
  var url = nextUrl || null;
  return dispatch => {
    return new Promise(function(resolve, reject) {
      fetchInsta(url, (err, value) => {
        if (err) return reject
        dispatch(setInsta(value))
        resolve(value)
      })
    });
  }
}
