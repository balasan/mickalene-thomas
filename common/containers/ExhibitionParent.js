import React, { Component, PropTypes } from 'react';
import { fetchContact } from '../api/contact';
import * as WorkActions from '../actions/work'
import * as MenuActions from '../actions/menu'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ExhibitionImages from '../components/ExhibitionImages';

class ExhibitionParent extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }
  static fetchExhibitionOnClient(dispatch, id) {
    var { loadExhibition } = bindActionCreators(WorkActions, dispatch, id)
    return Promise.all([
      loadExhibition(id)
    ])
  }

  static fetchWorkOnClient(dispatch, filter) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }

  componentDidMount() {
    var self = this;
    this.constructor.fetchExhibitionOnClient(this.props.dispatch, this.props.params.itemId);
    if (!this.props.state.works.arr.length) {
      this.constructor.fetchWorkOnClient(this.props.dispatch, this.props.params.filter);
    }
  }

  componentDidUpdate() {
    var self = this;
  }

  render () {
    var self = this;
    var item = null;
    var workObj = null;
    var itemId = null;
    var items = null;
    if (self.props.state.works) {
      if (self.props.state.works.exhibition) {
        if (self.props.state.works.exhibition.arr) {
          items = self.props.state.works.exhibition.arr;
        }
      }
    }

    return (
    <div>
      <ExhibitionImages {...self.props} filteredWorks={items} />
    </div>
  );
  }
}

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(Object.assign({}, MenuActions, WorkActions), dispatch))
  })(ExhibitionParent)











