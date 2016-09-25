import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';


import { works, workItem } from './work'
import menu from './menu'
import news from './news'
import insta from './insta'
import store from './store'

const rootReducer = combineReducers({
  routing: routerReducer,
  works,
  menu,
  news,
  workItem,
  insta,
  store
})

export default rootReducer
