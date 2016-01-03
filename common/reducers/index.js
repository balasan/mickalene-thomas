import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router';

import { works, workItem } from './work'
import currentitem from './work'
import menu from './menu'
import news from './news'

const rootReducer = combineReducers({
  routing: routeReducer,
  works,
  menu,
  news,
  workItem
})

export default rootReducer
