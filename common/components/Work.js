import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'

// const Counter = (props) => {
export default class Work extends Component {

  componentDidMount() {
    //put js stuff here
    // console.log(window.innerWidth);
  }
  render () {
    const { work, clickitem } = this.props
      // const { work.all, setitem } = this.props
    //TODO maybe it makes sense to simplify the native prismic data structure?
    //so its more like work[i].mainImage work[i].description - this could be done in api section
    // var url = work ? work.results[0].data["image.image"].value.main.url : ""

    return (
      <div>
      <section className='showcase'>
      <div className="image">
      {work ? (work.currentitem ? <img src={work.currentitem.results[0].data["image.image"].value.main.url} /> : <p>nothing seleted</p>) : (null) }
      </div>
      <div className="description">
            {work ? (work.currentitem ? <div><p>{work.currentitem.results[0].data["image.title"].value[0].text}</p><p>{work.currentitem.results[0].data["image.date"].value.substr(0, 4)}</p></div> : <p>nothing selected</p>) : (null) }
      </div>
      </section>
      <seciton className='workGrid'>
       {work ? work.all.results.map(function (item, i) {
                    return (
                     <img key={i} onClick={clickitem.bind(i, item.id)} src={item.data["image.image"].value.main.url} />
                    ) }, this) : null}
      </seciton>
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
  })(Work)
