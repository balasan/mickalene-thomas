import { GET_WORK } from '../actions/work'
import { GET_WORK_ITEM } from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { arr: [], obj: null }

const works = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORK:
      return Object.assign({}, state, {
        arr: action.payload.results[0],
        obj: action.payload.results[1]
      })
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