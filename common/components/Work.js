import React, { Component, PropTypes } from 'react'


// const Counter = (props) => {
export default class App extends Component {

  componentDidMount() {
    console.log(window.innerWidth);
  }

  render () {
    const { work } = this.props
    return (
      <div>
      {work}
      </div>
    )
  }
}