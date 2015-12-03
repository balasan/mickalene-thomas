import React, { Component, PropTypes } from 'react'


// const Counter = (props) => {
export default class Work extends Component {

  componentDidMount() {
    //put js stuff here
    console.log(window.innerWidth);
  }
  render () {
    const { work } = this.props
    //TODO maybe it makes sense to simplify the native prismic data structure?
    //so its more like work[i].mainImage work[i].description - this could be done in api section
    var url = work ? work.results[0].data["image.image"].value.main.url : ""
    console.log(work);

    return (
      <div className='workGrid'>
       {work ? work.results.map(function (item, i) {
                    return (
                      <img key={i} src={item.data["image.image"].value.main.url} />
                    )
                }, this) : null}
      </div>
    )
  }
}
