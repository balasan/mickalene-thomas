import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router';

import counter from './counter'
import work from './work'
import menu from './menu'

const rootReducer = combineReducers({
  routing: routeReducer,
  counter,
  work,
  menu
})

export default rootReducer
