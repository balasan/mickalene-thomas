import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router';

import work from './work'
import menu from './menu'
import news from './news'

const rootReducer = combineReducers({
  routing: routeReducer,
  work,
  menu,
  news
})

export default rootReducer
