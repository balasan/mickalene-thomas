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

  static fetchWorkOnClient(dispatch, filter) {
    var { loadWork } = bindActionCreators(WorkActions, dispatch, filter)
    return Promise.all([
      loadWork(filter)
    ])
  }

  componentDidMount() {
    var self = this;
    if (!this.props.state.works.obj) {
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
    var images = null;
    if (self.props.state.works) {
      if (self.props.state.works.obj) {
        workObj = self.props.state.works.obj;
        if (self.props.params.itemId) itemId = self.props.params.itemId;
        if (itemId) item = workObj[itemId];
        if (item) images = item.exhibitionImages
      }
    }

    return (
    <div>
      <ExhibitionImages {...self.props} filteredWorks={images} />
    </div>
  );
  }
}

// export default ExhibitionParent

export default connect(
  state => {
    return {state: state}
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(Object.assign({}, MenuActions, WorkActions), dispatch))
  })(ExhibitionParent)











