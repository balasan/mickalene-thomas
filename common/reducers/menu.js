import { TOGGLE } from '../actions/menu'
import { TOGGLE_LINKS } from '../actions/menu'
import { TOGGLE_NAV } from '../actions/menu'
import { GET_MENU } from '../actions/menu'
import { HIDE_MENU } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { showMenu:false }

export default function menu(state = initialState, action) {
  console.log(action, 'menu action')
  switch (action.type) {

    case TOGGLE_LINKS:
      return Object.assign({}, state, {
        toggleLinks: state.showMenu = !state.showMenu
      })

    case HIDE_MENU:
      return Object.assign({}, state, {
        showMenu: false
      })

    // case UPDATE_PATH:
      // console.log("UPDATING PATH")
      // return Object.assign({}, state, {
      //   showMenu: false
      // })

    default:
      return state
  }
}