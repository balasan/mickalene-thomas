import React, { Component, PropTypes } from 'react'


// const Counter = (props) => {
export default class Work extends Component {

  componentDidMount() {
    console.log(window.innerWidth);
  }
  render () {
    const { work } = this.props

    var url = work ? work.results[0].data["image.image"].value.main.url : ""
    console.log(work);

    return (
      <div className='workGrid'>
       {work ? work.results.map(function (item) {
                    return (
                      <img src={item.data["image.image"].value.main.url} />
                    )
                }, this) : null}
      </div>
    )
  }
}
