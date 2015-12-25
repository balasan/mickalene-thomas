import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WorkActions from '../actions/work'
import flexImages from './flex-full'
import range from 'lodash.range';
import presets from '../presets';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactTransitionGroup from 'react-addons-transition-group';

// import {Motion, spring, TransitionMotion, StaggeredMotion} from 'react-motion';

export default class Work extends Component {

  componentDidMount() {
    this.flex = new flexImages({ selector: '.flex-images', rowHeight: 250 })
  }

  componentWillUpdate(){

  }

  componentDidUpdate() {

    // var tempFlex = new flexImages({ 
    //   selector: '.flex-images',
    //   container: '.item:not(.example-leave)',
    //   rowHeight: 250,
    //   noRender:true
    // })
    // this.timeout = tempFlex.maxDelay * 1000 || 0;


    // setTimeout(function(){
      // if(this.props.work && !this.props.work.all.length) return;

      var timeout = this.timeout || 0;
      this.flex = new flexImages({
        selector: '.flex-images',
        container: '.item:not(.example-leave)',
        rowHeight: 250,
      })
      // window.timeout = this.flex.maxDelay * 1000 || 0;
      // this.timeout = window.timeout;
      // this.oldTimeout = window.timeout
    // }.bind(this), 0);

    //     var finish = new Date();
    // } else {
    //   // console.log("FLEX TIMEOUT", this.timeout);
    //   this.oldTimeout = this.timeout * 1000 || 0;
    //   // var tmpFlex = new flexImages({ selector: '.flex-images', rowHeight: 250, noRender:true })
    //   // this.timeout = tmpFlex.maxDelay * 1000 || 0;
    //   // this.timouet = Math.floor(this.timeout);
    //   console.log("TMP TIMEOUT", this.timeout)

    //   setTimeout(function() {
    //     this.flex
    //     this.flex = new flexImages({ selector: '.flex-images', rowHeight: 250 })
    //     // this.newTimeout = this.flex.maxDelay * 1000
    //     this.timeout = this.flex.maxDelay * 1000 || 0;
    //     // console.log("NEW TIMEOUT", this.timeout)

    //   }.bind(this), 500);
    // }
  }

  render () {
    const { work } = this.props
    // console.log(work, 'work now')
    // const timeout = Math.floor(this.timeout);
    // console.log("RENDER TIMEOUT", timeout)
    // if(!this.flex || !process.env.BROWSER) return null;


    var all = null;

    if (work) {
        var all = (
        <div>
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={400}
          >
           {work.all.map(function (item, i) {
              return (
                  <Link className='item' data-w={item.image.small.dimensions.width} data-h={item.image.small.dimensions.height} key={item.id} to={'/works/i/' + item.id}>
                    <img
                      key={item.id}
                      src={item.image.small.url}
                    />
                  </Link>
              )
            }, this)}
          </ReactCSSTransitionGroup>
        </div>)
    }

    return (
      <div className='flex-images'>
        {all}
      </div>
    )
  }
}

