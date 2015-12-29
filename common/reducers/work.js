import { GET_WORK } from '../actions/work'
import { GET_ITEM } from '../actions/work'
import { SET_FLEX } from '../actions/work'
import { SHOW_FILTERED } from '../actions/menu'
import { SHOW_ALL } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

export default function work(state = null, action) {
  console.log(action, 'action')
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
          store: action.payload.results,
          flex: false
        })
      }

    case GET_ITEM:
      return Object.assign({}, state, {
        currentitem: action.payload
      })

    case SHOW_FILTERED:
      return Object.assign({}, state, {
          all: state.filtered
        })

    case SHOW_ALL:
      return Object.assign({}, state, {
          all: state.store
        })

    case SET_FLEX:
      return Object.assign({}, state, {
          flex: action.payload
        })

    case UPDATE_PATH:
      var simplePath = action.path.substr(0, 8);

      if (simplePath != '/works/i' && simplePath != '/works' && simplePath != '/works/f') {
          return Object.assign({}, state, {
            flex: false
          })
      }

      if (simplePath != '/works/i' && simplePath != '/works' && state) {
        var filter = action.path.substr(14, action.path.length)
        var filtered = [];
        if(!state.store) state.store = [];

        state.store.forEach(function(item) {
          if (item.tags.indexOf(filter) > -1) {
            filtered.push(item)
          }
        })

        return Object.assign({}, state, {
          filter: filter,
          all: filtered,
          filtered: filtered
        })
      }

      if (simplePath == '/works/i' && state) {
        var id = action.path.substr(9, action.path.length);
        var selected = [];
        if(!state.store) state.store = [];

        state.store.forEach(function(item) {
          if (item.id == id) {
            selected.push(item)
          }
        })

        return Object.assign({}, state, {
          currentitem: selected,
          flex: false
        })
      }

      if (simplePath == '/works' && state) {
        return Object.assign({}, state, {
          all: state.store
        })

      }

    default:
      return state
  }
}