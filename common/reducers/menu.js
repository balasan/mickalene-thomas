import { TOGGLE } from '../actions/menu'
import { GET_MENU } from '../actions/menu'

export default function menu(state = null, action) {
  switch (action.type) {
    case GET_MENU:
      return Object.assign({}, state, {
        toggle: false
      })
    case TOGGLE:
      return Object.assign({}, state, {
        toggle: state.toggle =! state.toggle
      })
    default:
      return state
  }
}