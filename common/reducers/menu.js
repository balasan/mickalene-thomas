import { TOGGLE_MENU } from '../actions/menu'
import { SET_WORK_TAGS } from '../actions/menu'
import { SET_NEWS_TAGS } from '../actions/menu'
import { TOGGLE_EXPAND } from '../actions/menu'
import { UPDATE_PATH } from 'redux-simple-router'

const initialState = { showMenu:false, expand:false }

export default function menu(state = initialState, action) {
  switch (action.type) {

    case TOGGLE_MENU:
      return Object.assign({}, state, {
        showMenu: !state.showMenu
      })

    case TOGGLE_EXPAND:
      return Object.assign({}, state, {
        expand: !state.expand
      })

    case SET_WORK_TAGS:
      return Object.assign({}, state, {
        workTags: action.payload
      })

    case SET_NEWS_TAGS:
      return Object.assign({}, state, {
        newsTags: action.payload
      })

    default:
      return state
  }
}