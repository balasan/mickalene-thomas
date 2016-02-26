export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_EXPAND = 'TOGGLE_EXPAND';
export const SET_WORK_TAGS = 'SET_WORK_TAGS';
export const SET_NEWS_TAGS = 'SET_NEWS_TAGS';
export const SHOW_LOADER = 'SHOW_LOADER';
import { fetchWorkTags } from '../api/work'
import { fetchNewsTags } from '../api/work'

export function toggleMenu() {
  return {
    type: TOGGLE_MENU
  };
}

export function toggleExpand() {
  return {
    type: TOGGLE_EXPAND
  };
}

export function setWorkTags(value) {
  return {
    type: SET_WORK_TAGS,
    payload: value
  };
}

export function setNewsTags(value) {
  return {
    type: SET_NEWS_TAGS,
    payload: value
  };
}

export function loadWorkTags() {
  return dispatch => {
    fetchWorkTags((err, value) => {
      if (err) return reject
      dispatch(setWorkTags(value))
    })
  }
}

export function loadNewsTags() {
  return dispatch => {
    fetchNewsTags((err, value) => {
      if (err) return reject
      dispatch(setNewsTags(value))
    })
  }
}

export function showLoader(value) {
 return {
    type: SHOW_LOADER,
    payload: value
  };
}