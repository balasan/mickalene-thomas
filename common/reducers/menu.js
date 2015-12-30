import { TOGGLE_LINKS } from '../actions/menu'
import { SET_TAGS } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { showMenu:false }

export default function menu(state = initialState, action) {
  switch (action.type) {

    case TOGGLE_LINKS:
      return Object.assign({}, state, {
        toggleLinks: state.showMenu = !state.showMenu
      })

    case SET_TAGS:
      return Object.assign({}, state, {
        tags: action.payload
      })

    default:
      return state
  }
}