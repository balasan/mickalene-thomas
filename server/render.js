import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import qs from 'qs';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';

function renderFullPage(html, initialState) {

  var styles;
  //load extracted styles in head when in production
  if(process.env.NODE_ENV == 'development') styles = "";
  else styles = '<link rel="stylesheet" href="/styles.css" />';

  return `
    <!doctype html>
    <html>
      <head>
        <title>Mickalene Thomas</title>
        <meta property="og:image"              content="images/fb.png" />
        <meta property="og:url"                content="http://www.mickalenethomas.com/" />
        <meta property="og:type"               content="website" />
        <meta property="og:title"              content="Mickalene Thomas" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        ${styles}
      </head>
      <body>
        <div class="bg"></div>
        <video id="vidBg" preload="none" class="hidden video" playsinline webkit-playsinline loop="true">
          <source src="/video/menu.mp4" type="video/mp4"/>
        </video>
        <video id="vidPattern" preload="none" class="hidden video" playsinline webkit-playsinline loop="true">
          <source src="/video/bg-vid.mp4" type="video/mp4"/>
        </video>

        <div class='tint'></div>

        <!--
        <div class="m2d">
          <svg viewBox="0 0 600 300" class="svg-defs">
            <symbol id="s-text">
              <text text-anchor="middle" x="50%" y="50%" dy=".35em" class="text">
                  M
              </text>
            </symbol>
            <mask id="m-text" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <rect width="100%" height="100%" class="mask__shape">
              </rect>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-text" class="mask__text"></use>
            </mask>
          </svg>
          <div class="box-with-text">
            <div class="text-fill">
              <video class="video" src="video/bg-vid.mp4" autoplay="" loop=""></video>
            </div>
            <svg viewBox="0 0 600 300" class="svg-inverted-mask">
              <rect width="100%" height="100%" mask="url(#m-text)" class="shape--fill"></rect>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#s-text" class="text--transparent"></use>
            </svg>
          </div>
        </div> -->

        <div id="nowebgl" class="hidden bg">
          <img src="/images/nowebgl.jpg">
        </div>
        <canvas id="webGL"></canvas>

        <div id="app">${html}</div>
         <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `
}

//fetch data on server
// export default function fetchComponentData(dispatch, components, params) {
//   const promises = components.reduce( (prev, current) => {

//     // var currentFetch = current.fetchData ? [current.fetchData(dispatch, params)] : [];
//     // .concat(prev)
//     return ( current.fetchData ? [current.fetchData(dispatch, params)] : [])
//       // .concat((current.WrappedComponent && current.fetchData ? [current.fetchData(dispatch, params)] : []) || [])
//       .concat(prev);
//   }, []);


//   console.log(promises);
//   return Promise.all(promises);
// }

export default function fetchComponentData(dispatch, components, params) {
  const promises = components
    .filter((component) => component && component.fetchData) // 1
    .map((component) => component.fetchData) // 2
    .map(fetchData =>
      fetchData(dispatch, params)); // 3
    console.log(promises)
    return Promise.all(promises);
}

export default function handleRender(req, res) {
  // Query our mock API asynchronously
  // fetchCounter(apiResult => {
    // Read the counter from the request, if provided

    const params = qs.parse(req.query);
    // const counter = parseInt(params.counter, 10) || apiResult || 0;

    // Compile an initial state
    // const initialState = { counter };

    const initialState = {routing : {path: req.originalUrl}};

    // Create a new Redux store instance
    const store = configureStore(initialState);

    match(
      {routes: routes, location: req.originalUrl},
      (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', error);
          res.status(500);
        } else if (!renderProps) {
          res.status(500);
        } else {


          // console.log("RENDERING", req.originalUrl)

          var renderHtml = () => {
            const component = (
              <Provider store={store}>
                <div>
                  <RouterContext {...renderProps}/>
                </div>
              </Provider>
            );
            return renderToString(component);
          }

          // this code pre-fills the data on the server
          // fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
          //   .then(() => {
          //     console.log("GOT DATA, RENDERING COMPONENTS")
          //     res.send(renderFullPage(renderHtml(), store.getState()))
          //   })
          //   .catch(err => res.end(err.message));

          res.send(renderFullPage(renderHtml(), store.getState()));
        }
      }
    )
}


