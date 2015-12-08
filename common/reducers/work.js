import { GET_WORK } from '../actions/work'
import { GET_ITEM } from '../actions/work'
import { SET_FILTER } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

export default function getwork(state = null, action) {
  switch (action.type) {

    case GET_WORK:
      if (action.payload.filter) {

          var filtered = [];

          action.payload.results.forEach(function(item) {
            if (item.tags.indexOf(action.payload.filter) > -1) {
              filtered.push(item)
            }
          })

          return Object.assign({}, state, {
            filter: action.payload.filter,
            all: filtered,
            store: action.payload.results
          })

      } else {
        return Object.assign({}, state, {
          all: action.payload.results,
          store: action.payload.results
        })
      }

    case GET_ITEM:
      return Object.assign({}, state, {
        currentitem: action.payload
      })

    case SET_FILTER:
      if (action.payload != 'all') {

        var filtered = [];

        state.store.forEach(function(item) {
          if (item.tags.indexOf(action.payload) > -1) {
            filtered.push(item)
          }
        })

        return Object.assign({}, state, {
          filter: action.payload,
          all: filtered
        })

      } else {
        return Object.assign({}, state, {
          filter: action.payload,
          all: state.store
        })
      }

    default:
      return state
  }
}