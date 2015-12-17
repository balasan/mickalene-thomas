import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Menu from '../components/Menu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MenuActions from '../actions/menu';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

if(process.env.BROWSER){
  require('./../../client/css/index.css');
  require('./../../client/css/links.css');
  require('./../../client/css/work.css');
  require('./../../client/css/about.css');
  require('./../../client/css/news.css');
  require('./../../client/css/store.css');
  require('./../../client/css/contact.css');
  require('./../../client/css/item.css');
  require('./../../client/css/navbar.css');
}
export default class App extends Component {
  static fetchMenu(dispatch, length) {
    var { loadMenu } = bindActionCreators(MenuActions, dispatch, length)

    return Promise.all([
      loadMenu(length)
    ])
  }

  componentDidMount() {
      this.constructor.fetchMenu(this.props.dispatch, this.props.location.pathname.length);
  }

  render () {
    console.log(this.props, 'app props')
    return (
    <div>
        <Menu { ...this.props }></Menu>
        <main className={this.props.menu.toggleLinks ? 'hideMe' : null}>
          {this.props.children}
        </main>
    </div>
    );
  }
}

// --------- same as (only need above fore more complex objects) --------

// const App = (props) => {

//   return (
//     <div>
//     <Menu { ...props.props }></Menu>
//       <section>
//         {props.children}
//       </section>
//     </div>
//   );

// }

// export default connect(
//   state => {
//     return {togglestate: state.menu}
//   },
//   dispatch => {
//     return bindActionCreators(MenuActions, dispatch)
//   })(App)

export default connect(
  state => {
    // console.log(state, "state.menu on app")
    return {menu: state.menu}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
  })(App)


// export default App
