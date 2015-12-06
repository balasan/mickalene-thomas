import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Work from '../components/Work';
import * as WorkActions from '../actions/work'
import { fetchWork } from '../api/work';
import { fetchItem } from '../api/work';

export default class Item extends Component {

  static fetchItem(dispatch, id) {
    var { loadItem } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadItem(id)
    ])
  }

  componentDidMount() {
    if (!this.props.work) {
      var id = this.props.routeParams.itemId;
      this.constructor.fetchItem(this.props.dispatch, id);
    }
  }

  render () {
    const { work } = this.props
    console.log(this.props, "props")
    console.log(work, "work")
    return (
      <div>
      {work ? (work.currentitem ? <img src={work.currentitem.results[0].data["image.image"].value.main.url} /> : <img src={work.all.results[0].data["image.image"].value.main.url} />) : (null) }
      </div>
    )
  }
}

export default connect(
  state => {
    return {work: state.work}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(WorkActions, dispatch))
  })(Item)

// export default Item