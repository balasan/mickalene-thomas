export const TOGGLE_LINKS = 'TOGGLE_LINKS';
export const SET_TAGS = 'SET_TAGS';
import { fetchTags } from '../api/work'

export function toggleLinks() {
  console.log("toggleLinks")
  return {
    type: TOGGLE_LINKS
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