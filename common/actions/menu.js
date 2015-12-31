export const TOGGLE_MENU = 'TOGGLE_MENU';
export const SET_TAGS = 'SET_TAGS';
import { fetchTags } from '../api/work'

export function toggleMenu() {
  console.log("toggleMenu")
  return {
    type: TOGGLE_MENU
  };
}

export function setTags(value) {
  return {
    type: SET_TAGS,
    payload: value
  };
}

export function loadTags() {
  return dispatch => {
    fetchTags((err, value) => {
      if (err) return reject
      dispatch(setTags(value))
    })
  }
}