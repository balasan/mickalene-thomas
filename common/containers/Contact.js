import React, { Component, PropTypes } from 'react';
import { fetchContact } from '../api/contact';

class Contact extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      contactData: null,
    }
  }

  componentDidMount() {
    var self = this;
    fetchContact(function(i, data) {
      self.setState({contactData: data});
    });
  }

  componentDidUpdate() {
    var self = this;
  }

  render () {
    var self = this;
    var galleries = null;
    var studioInfo = null;
    var imageEl = null;
    var studioEl = null;
    var galleriesEl = [];
    var mobileHeaderEl = (<div className='mobileHeader'></div>);

    if (this.state.contactData) {
      if (self.state.contactData.image) {
        imageEl = (<div style={{backgroundImage: 'url(' + self.state.contactData.image + ')'}} className='contactImg'></div>)
      }
      if (this.state.contactData.galleries) {
        galleries = this.state.contactData.galleries;
        for (var x in galleries) {
          galleriesEl.push(<div className='gallery-parent'>
            <div>
              <h2>{galleries[x].name}</h2>
              <p>{galleries[x].address}</p>
              {galleries[x].address2 ? '<p>' + galleries[x].address2 + '</p>' : ''}
              <p>{galleries[x].city}, {galleries[x].state} {galleries[x].zipcode}</p>
            </div>
            <div>
              <a href={'tel:' + galleries[x].phone.replace(/\D/g,'')}>tel: {galleries[x].phone}</a>
              <p>fax: {galleries[x].fax}</p>
            </div>
            <div>
              <a target="_blank" href={'mailto:' + galleries[x].email}>{galleries[x].email}</a>
              <a target="_blank" href={galleries[x].website}>{galleries[x].website}</a>
            </div>
          </div>)
        }
      }
      if (this.state.contactData.studio) {
        studioInfo = this.state.contactData.studio;
        studioEl = (<section className="studio">
          <main>
            <article>
              <div>
                <h2>{studioInfo.name}</h2>
                <a href={'mailto:' + studioInfo.email}>{studioInfo.email}</a>
              </div>
              {studioInfo.address ? <div>
                <p>{studioInfo.address}</p>
                {studioInfo.address2 ? '<p>' + studioInfo.address2 + '</p>' : ''}
                <p>{studioInfo.city}, {studioInfo.state} {studioInfo.zipcode}</p>
              </div> : null}
            </article>
            <article className="newsletter noselect">
              <input className="noselect" placeholder="Subscribe to Newsletter" />
              <button>Submit</button>
            </article>
            <article className="social noselect">
              <a className="fb" href={studioInfo.fb}></a>
              <a className="twitter" href={studioInfo.twitter}></a>
              <a className="insta" href={studioInfo.insta}></a>
            </article>
            </main>
          </section>);

          mobileHeaderEl = (<div className='mobileHeader'><p>{studioInfo.name}</p><a href={'mailto:' + studioInfo.email}>{studioInfo.email}</a></div>);
      }
    }
    return (
    <div className='contactParent'>
      {imageEl}
      {mobileHeaderEl}
      <div className="contactTxt">
        <section className="galleries">
          <article>{galleriesEl}</article>
        </section>
        {studioEl}
      </div>
    </div>
  );
  }
}

export default Contact












