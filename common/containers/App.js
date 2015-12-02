import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter'

if(process.env.BROWSER)
  require('./../../client/css/index.scss');

// export default class App extends Component {
//   render () {
//     return (
//       <div>
//         <h1>Redux Universal App</h1>
//         <section>
//           <Link to="/home">Home</Link>
//           { ' - ' }
//           <Link to="/about">About</Link>
//           { ' - ' }
//           <Link to="/counter">Counter</Link>
//         </section>
//         <br />
//         <section>
//           {this.props.children}
//         </section>
//       </div>
//     );
//   }
// }

// --------- same as (only need above fore more complex objects) --------

const App = (props) => {
  var location;
  if(props.children.props.route.path) {
      location = props.children.props.route.path;
  } else {
    location = 'home';
  }
  return (
    <div>

      <nav>
      {location}
      <div className='holdImg'>
      <img src='images/menu.svg' />
      </div>
      </nav>

      <section className='links'>
        <Link to="/home">home</Link>
        <Link to="/about">about</Link>
        <Link to="/works">works</Link>
        <Link to="/news">news</Link>
        <Link to="/counter">counter</Link>
      </section>

      <section>
        {props.children}
      </section>

    </div>
  );
}

// export default connect(
//   state => {
//     return {counter: state.counter}
//   },
//   dispatch => {
//     return bindActionCreators(CounterActions, dispatch)
//   })(App)

export default App
