import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import debug from 'debug';
import createHistory from 'history/lib/createBrowserHistory';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';

const clientDebug = debug('app:client');
const rootElement = document.getElementById('app');
const routes = require('../common/routes');

window.React = React; // For chrome dev tool support

if (process.env.DEV) {
  window.reduxDebug = debug;
  window.reduxDebug.enable('*'); // this should be activated only on development env
}
let initialState = window.__INITIAL_STATE__ || undefined;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

clientDebug('rehydrating app');

render(
  <Provider store={store}>
    <div>
      <Router routes={routes} history={browserHistory}/>
    </div>
  </Provider>,
  rootElement
);


