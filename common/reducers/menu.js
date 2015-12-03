import { TOGGLE } from '../actions/menu'
import { GET_MENU } from '../actions/menu'

export default function counter(state = false, action) {
  switch (action.type) {
    case GET_MENU:
      return state
    case TOGGLE:
      return state = !state
    default:
      return state
  }
}
