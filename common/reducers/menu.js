import { TOGGLE_MENU } from '../actions/menu'

const initialState = { showMenu:false }

export default function menu(state = initialState, action) {
  console.log(action, 'menu action')
  switch (action.type) {

    case TOGGLE_MENU:
      return Object.assign({}, state, {
        showMenu: !state.showMenu
      })

    default:
      return state
  }
}