import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import News from '../components/News';
import * as NewsActions from '../actions/news'

if(process.env.BROWSER){
  require('./../../client/css/news.css');
}

export default class NewsParent extends Component {

  static fetchNewsDataOnClient(dispatch) {
    var { loadNews } = bindActionCreators(NewsActions, dispatch)
    return Promise.all([
      loadNews()
    ])
  }

    static fetchInstaDataOnClient(dispatch) {
    var { loadInsta } = bindActionCreators(NewsActions, dispatch)
    return Promise.all([
      loadInsta()
    ])
  }

  componentDidMount() {
      this.constructor.fetchNewsDataOnClient(this.props.dispatch);
      this.constructor.fetchInstaDataOnClient(this.props.dispatch);
  }

  render () {
    return (
      <div>
        <News { ...this.props }/>
      </div>
      )
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(NewsActions, dispatch))
  })(NewsParent)
