import React, { Component, PropTypes } from 'react'


// const Counter = (props) => {
export default class Work extends Component {

  componentDidMount() {
    console.log(window.innerWidth);
    console.log(this.props, "this.props")
  }
  render () {
    const { work } = this.props
    var url = work ? work.results[0].data["image.image"].value.main.url : ""
    return (
      <div>
        <img src={url} />
      </div>
    )
  }
}
// Work.propTypes = {
//   work: PropTypes.number.isRequired
// }