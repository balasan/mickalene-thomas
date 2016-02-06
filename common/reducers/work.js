import { GET_WORK } from '../actions/work'
import { GET_WORK_ITEM } from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

const works = (state = [], action) => {
  switch (action.type) {
    case GET_WORK:
      return action.payload.results;
    default: return state;
  }
}


const workItem = (state = null, action) => {
  switch (action.type) {
    case GET_WORK_ITEM:
      return action.payload;
    default: return state;
  }
}

module.exports = {
  workItem: workItem,
  works: works
}