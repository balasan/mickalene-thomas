import React from 'react';

import App from './containers/App';
import Splash from './containers/Splash';
import About from './containers/About';
import Contact from './containers/Contact';
import News from './containers/News';
import Works from './containers/Works';
import Store from './containers/Store';
import WorkItem from './containers/WorkItem';
import NotFound from './containers/NotFound';

var routes = {
  path: '/',
  component: App,
  indexRoute: { component: Splash },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'news', component: News },
    { path: 'works', component: Works },
    { path: 'works/i/:itemId', component: WorkItem },
    { path: 'works/filter/:filter', component: Works },
    { path: 'contact', component: Contact },
    { path: 'store', component: Store },
    // { path: 'splash', component: Splash },
    { path: '*', component: NotFound }
  ]
};

module.exports = routes;