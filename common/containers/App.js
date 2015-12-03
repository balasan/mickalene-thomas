import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
import Menu from '../components/Menu';
// import * as MenuActions from '../actions/menu'
// import { fetchMenu } from '../api/menu';

if(process.env.BROWSER) {
    require('./../../client/css/index.css');
}

export default class App extends Component {

  render () {
    return (
    <div>
    <Menu { ...this.props }></Menu>
      <section>
        {this.props.children}
      </section>

    </div>
    );
  }
}

// --------- same as (only need above fore more complex objects) --------

// const App = (props) => {

//   static fetchData(dispatch) {
//     var { loadMenu } = bindActionCreators(MenuActions, dispatch)
//     return Promise.all([
//       loadMenu()
//     ])
//   }

//   componentDidMount() {
//     if (!this.props.menu) {
//       this.constructor.fetchData(this.props.dispatch);
//     }
//   }

//   return (
//     <div>
//     <Menu { ...this.props }></Menu>
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

// export default connect(
//   state => {
//     // console.log(state, "state.work")
//     return {togglestate: state.menu}
//   },
//   dispatch => {
//     return Object.assign({}, { dispatch },  bindActionCreators(MenuActions, dispatch))
//   })(App)


// export default App
