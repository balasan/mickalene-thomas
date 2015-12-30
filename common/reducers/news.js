import { GET_NEWS} from '../actions/news'
import { UPDATE_PATH } from 'redux-simple-router'

export default function work(state = null, action) {
  switch (action.type) {

    case GET_NEWS:
        return Object.assign({}, state, {
          all: action.payload.results,
        })

    case UPDATE_PATH:
      // var simplePath = action.path.substr(0, 5);

      // if (simplePath == '/news' && state) {

      //   return Object.assign({}, state, {
      //     all: filtered,
      //   })
      // }

      // if (simplePath == '/works/i' && state) {
      //   var id = action.path.substr(9, action.path.length);
      //   var selected = [];

      //   state.store.forEach(function(item) {
      //     if (item.id == id) {
      //       selected.push(item)
      //     }
      //   })

      //   return Object.assign({}, state, {
      //     currentitem: selected
      //   })
      // }

      // if (simplePath == '/works' && state) {
      //   return Object.assign({}, state, {
      //     all: state.store
      //   })

      // }

    default:
      return state
  }
}