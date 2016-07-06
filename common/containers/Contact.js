import React, { Component, PropTypes } from 'react';
import { fetchContact } from '../api/contact';

export default class Contact extends Component {

  componentDidMount() {
    var self = this;
    fetchContact(function(i, data) {
      self.contactData = data;
      self.render();
    });
    this.studioEl = false;
    this.galleriesEl = false;
    this.mobileHeaderEl = false;
  }

  componentDidUpdate() {
    var self = this;
    fetchContact(function(i, data) {
      self.contactData = data;
      self.render();
    });
  }

  render () {
    var self = this;
    var galleries = null;
    var studioInfo = null;
    var imageEl = null;

    if (this.contactData) {
      if (self.contactData.image) {
        imageEl = (<div style={{backgroundImage: 'url(' + self.contactData.image + ')'}} className='contactImg'></div>)
      }
      if (this.contactData.galleries && !this.galleriesEl) {
        galleries = this.contactData.galleries;
        galleries.forEach(function(gallery, i){
          self.galleriesEl = `<div>
            <h2>${gallery.name}</h2>
            <p>${gallery.address}</p>
            ${gallery.address2 ? '<p>' + gallery.address2 + '</p>' : ''}
            <p>${gallery.city}, ${gallery.state} ${gallery.zipcode}</p>
          </div>
          <div>
            <a href=${'tel:' + gallery.phone.replace(/\D/g,'')}>tel: ${gallery.phone}</a>
            <p>fax: ${gallery.fax}</p>
          </div>
          <div>
            <a target="_blank" href=${'mailto:' + gallery.email}>${gallery.email}</a>
            <a target="_blank" href=${gallery.website}>${gallery.website}</a>
          </div>`;
          var article = document.createElement("article");
          article.innerHTML = self.galleriesEl;
          var container = document.getElementsByClassName('galleries')[0];
          container.appendChild(article);
        })
      }
      if (this.contactData.studio && !this.studioEl) {
        studioInfo = this.contactData.studio;
        self.studioEl = `<article>
            <div>
              <h2>${studioInfo.name}</h2>
              <a href=${'mailto:' + studioInfo.email}>${studioInfo.email}</a>
            </div>
            <div>
              <p>${studioInfo.address}</p>
              ${studioInfo.address2 ? '<p>' + studioInfo.address2 + '</p>' : ''}
              <p>${studioInfo.city}, ${studioInfo.state} ${studioInfo.zipcode}</p>
            </div>
          </article>
          <article class="newsletter noselect">
            <input class="noselect" placeholder="Subscribe to Newsletter" />
            <button>Submit</button>
          </article>
          <article class="social noselect">
            <a class="fb" href=${studioInfo.fb}></a>
            <a class="twitter" href=${studioInfo.twitter}></a>
            <a class="insta" href=${studioInfo.insta}></a>
          </article>`;
          var div = document.createElement("main");
          div.innerHTML = self.studioEl;
          var container = document.getElementsByClassName('studio')[0];
          container.appendChild(div);

          self.mobileHeaderEl = `<p>${studioInfo.name}</p><a href=${'mailto:' + studioInfo.email}>${studioInfo.email}</a>`;
          var mobileParent = document.createElement("div");
          mobileParent.innerHTML = self.mobileHeaderEl;
          var mobileContainer = document.getElementsByClassName('mobileHeader')[0];
          mobileContainer.appendChild(mobileParent);
      }
    }

    return (
    <div className='contactParent'>
      {imageEl}
      <div className='mobileHeader'>
      </div>
      <div className="contactTxt">
        <section className="galleries">
        </section>
        <section className="studio">
        </section>

      </div>
    </div>
  );
  }
}












