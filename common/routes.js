import React from 'react';

import App from './containers/App';
import Splash from './containers/Splash';
import About from './containers/About';
import Contact from './containers/Contact';
import NewsParent from './containers/NewsParent';
import WorkParent from './containers/WorkParent';
import StoreParent from './containers/StoreParent';
import ProductParent from './containers/ProductParent';
import ExhibitionParent from './containers/ExhibitionParent';
import ExhibitionItem from './containers/ExhibitionItem';
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
    { path: 'works/i/:itemId', component: WorkParent },
    { path: 'works/exhibitions/:itemId', component: ExhibitionParent },
    { path: 'works/exhibitions/:itemId/:imageId', component: ExhibitionItem },
    { path: 'store', component: StoreParent },
    { path: 'store/:itemId', component: ProductParent },
    { path: 'works/filter/:filter', component: WorkParent },
    { path: 'news/filter/:filter', component: NewsParent },
    { path: 'cart', component: CartParent },
    { path: 'contact', component: Contact },
    { path: '*', component: NotFound }
  ]
};

module.exports = routes;