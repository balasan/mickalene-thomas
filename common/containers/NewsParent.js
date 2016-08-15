import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import News from '../components/News';
import * as WorkActions from '../actions/work'

if(process.env.BROWSER){
  require('./../../client/css/news.css');
}

export default class NewsParent extends Component {

  static fetchNewsDataOnClient(dispatch) {
    var { loadNews } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadNews()
    ])
  }

  static fetchInstaDataOnClient(dispatch) {
    var { loadInsta } = bindActionCreators(WorkActions, dispatch)
    return Promise.all([
      loadInsta(null)
    ])
  }

  componentDidMount() {
    var self = this;
    this.constructor.fetchInstaDataOnClient(this.props.dispatch);
    self.constructor.fetchNewsDataOnClient(this.props.dispatch);
    this.news = [];
    this.insta = [];
  }

  componentWillUpdate(nextProps) {
    var self = this;
    const { state, params } = nextProps;
    this.filterNews(state, params);
  }

  filterNews(state, params) {
    var self = this;

      self.news = state.news.filter(function(item) {
        if (params.filter && item.tags.indexOf(params.filter) === -1) {
          return false;
        } else {
          return true;
        }
      });
  }


  render () {
    return (
      <div className="container3d">
        <News { ...this.props } filteredNews={this.news} />
      </div>
      )
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(NewsParent)
