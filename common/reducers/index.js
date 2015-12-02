import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router';

import counter from './counter'
import work from './work'

const rootReducer = combineReducers({
  routing: routeReducer,
  counter,
  work
})

export default rootReducer
