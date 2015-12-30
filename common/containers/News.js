import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import News from '../components/News';
import * as NewsActions from '../actions/news'

if(process.env.BROWSER){
  require('./../../client/css/news.css');
}

export default class NewsParent extends Component {

  static fetchDataOnClient(dispatch) {
    var { loadNews } = bindActionCreators(NewsActions, dispatch)
    return Promise.all([
      loadNews()
    ])
  }

  componentDidMount() {
    // if (!this.props.work || !this.props.work.store || !this.props.work.store.length) {
      this.constructor.fetchDataOnClient(this.props.dispatch);
    // }
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
    return {news: state.news}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(NewsActions, dispatch))
  })(NewsParent)
