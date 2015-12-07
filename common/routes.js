import React from 'react';

import App from './containers/App';
import Home from './containers/Home';
import About from './containers/About';
import Contact from './containers/Contact';
import News from './containers/News';
import Works from './containers/Works';
import Store from './containers/Store';
import Counters from './containers/Counters';
import NotFound from './containers/NotFound';

var routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'news', component: News },
    { path: 'works', component: Works },
    { path: 'works/i/:itemId', component: Works },
    { path: 'works/type/:type', component: Works },
    { path: 'contact', component: Contact },
    { path: 'store', component: Store },
    { path: 'home', component: Home },
    { path: 'Counter', component: Counters },
    { path: '*', component: NotFound }
  ]
};

module.exports = routes;