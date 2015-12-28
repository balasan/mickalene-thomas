import { TOGGLE } from '../actions/menu'
import { TOGGLE_LINKS } from '../actions/menu'
import { TOGGLE_NAV } from '../actions/menu'
import { GET_MENU } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

export default function menu(state = null, action) {
  switch (action.type) {

    case GET_MENU:
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


    case UPDATE_PATH:
     if (action.path == '/') {
      return Object.assign({}, state, {
        toggleLinks: false,
        toggleNav: false
      })
      } else {
        return Object.assign({}, state, {
        toggleLinks: false,
        toggleNav: true
      })
      }

    case TOGGLE_LINKS:
      return Object.assign({}, state, {
        toggleNav: state.toggleNav = !state.toggleNav,
        toggleLinks: state.toggleLinks = !state.toggleLinks
      })

    default:
      return state
  }
}