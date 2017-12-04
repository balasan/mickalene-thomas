import React from 'react';

import App from './containers/App';
import Splash from './containers/Splash';
import About from './containers/About';
import Contact from './containers/Contact';
import NewsParent from './containers/NewsParent';
import WorkParent from './containers/WorkParent';
import StoreParent from './containers/StoreParent';
import ProductParent from './containers/ProductParent';
import CartParent from './containers/CartParent';
import NotFound from './containers/NotFound';

var routes = {
  path: '/',
  component: App,
  indexRoute: { component: Splash },
  childRoutes: [
    { path: 'splash/:id', component: Splash },
    { path: 'about', component: About },
    { path: 'news', component: NewsParent },
    { path: 'works', component: WorkParent },
    { path: 'works/exhibitions/:exhibitionId', component: WorkParent },
    { path: 'works/exhibitions/:exhibitionId/:exhibitionItemId', component: WorkParent },


    { path: 'store', component: StoreParent },
    { path: 'store/:itemId', component: StoreParent },

    { path: 'works/filter/:filter', component: WorkParent },
    { path: 'works/:filter/:itemId/:imgId', component: WorkParent },
    { path: 'works/:filter/:itemId', component: WorkParent },


    { path: 'news/filter/:filter', component: NewsParent },
    { path: 'cart', component: CartParent },
    { path: 'contact', component: Contact },
    { path: '*', component: NotFound }
  ]
};

module.exports = routes;