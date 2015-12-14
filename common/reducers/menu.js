import { TOGGLE } from '../actions/menu'
import { TOGGLE_LINKS } from '../actions/menu'
import { TOGGLE_NAV } from '../actions/menu'
import { GET_MENU } from '../actions/menu'

export default function menu(state = null, action) {
  switch (action.type) {
    case GET_MENU:
      console.log(action, 'get menu action')
      if (action.length > 1) {
              return Object.assign({}, state, {
        toggleNav: true,
        toggleLinks: false
      })
      } else {
              return Object.assign({}, state, {
        toggleNav: false,
        toggleLinks: false
      })
      }

    case TOGGLE:
      return Object.assign({}, state, {
        toggleNav: state.toggleNav = !state.toggleNav,
        toggleLinks: state.toggleLinks = !state.toggleLinks
      })

    case TOGGLE_LINKS:
      return Object.assign({}, state, {
        toggleLinks: state.toggleLinks = !state.toggleLinks
      })

    case TOGGLE_NAV:
      return Object.assign({}, state, {
        toggleNav: state.toggleNav = !state.toggleNav
      })

    default:
      return state
  }
}