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
          galleriesEl.push(<div key={x} className='gallery-parent'>
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
          <div>
            <article>
              <div className="contactColumn">
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
                <form action="//mickalenethomas.us13.list-manage.com/subscribe/post?u=2d03a31ddfd7885c7c19fb473&amp;id=126398a7f9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                  <div id="mc_embed_signup_scroll">
                  <h2>Subscribe to our mailing list</h2>
                  <br/>
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL"><p>Email Address *</p>
                </label>
                  <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" />
                </div>
                <div className="mc-field-group">
                  <label htmlFor="mce-FNAME"><p>First Name</p></label>
                  <input type="text" name="FNAME" className="" id="mce-FNAME" />
                </div>
                <div className="mc-field-group">
                  <label htmlFor="mce-LNAME"><p>Last Name</p></label>
                  <input type="text" name="LNAME" className="" id="mce-LNAME" />
                </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{display:'none'}}></div>
                    <div className="response" id="mce-success-response" style={{display:'none'}}></div>
                  </div>
                <div className="indicates-required"><p className="asterisk">* indicates required field</p></div>

                    <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true"><input type="text" name="b_2d03a31ddfd7885c7c19fb473_126398a7f9" tabIndex="-1" /></div>
                    <div className="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" /></div>
                    </div>
                </form>
            </article>
            <article className="social noselect">
              <a className="fb" href={studioInfo.fb}></a>
              <a className="twitter" href={studioInfo.twitter}></a>
              <a className="insta" href={studioInfo.insta}></a>
            </article>
            </div>
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












