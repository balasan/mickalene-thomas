import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(initialState = {}, history) {

  let middleware = applyMiddleware(thunk, routerMiddleware(history));

  const store = middleware(createStore)(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
