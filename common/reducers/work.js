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

    case UPDATE_PATH:
      var simplePath = action.path.substr(0, 8);
      var filter = action.path.substr(14, action.path.length)

      if (simplePath != '/works/i' && simplePath != '/works' && state) {

        var filtered = [];

        state.store.forEach(function(item) {
          if (item.tags.indexOf(filter) > -1) {
            filtered.push(item)
          }
        })

        return Object.assign({}, state, {
          filter: filter,
          all: filtered
        })

      }

      if (simplePath == '/works' && state) {
        return Object.assign({}, state, {
          filter: filter,
          all: state.store
        })
      }

    default:
      return state
  }
}