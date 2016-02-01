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
  }

  componentDidUpdate() {
    console.log('component update')
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

    if (this.contactData) {
      if (this.contactData.galleries && !this.galleriesEl) {
        galleries = this.contactData.galleries;
        galleries.forEach(function(gallery, i){
          self.galleriesEl = `<div>
            <h2>${gallery.name}</h2>
            <p>${gallery.address}</p>
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
              <p>${studioInfo.email}</p>
            </div>
            <div>
              <p>${studioInfo.address}</p>
              <p>${studioInfo.city}, ${studioInfo.state} ${studioInfo.zipcode}</p>
            </div>
          </article>
          <article class="newsletter">
            <input placeholder="Subscribe to Newsletter" />
            <button>Submit</button>
          </article>
          <article class="social">
            <a class="fb" href="http://facebook.com/mickalenethomas"></a>
            <a class="twitter" href="http://twitter.com/mickalenethomas"></a>
          </article>`;
          var div = document.createElement("main");
          div.innerHTML = self.studioEl;
          var container = document.getElementsByClassName('studio')[0];
          container.appendChild(div);
      }
    }

    return (
    <div>
      <div className='contactImg'>
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












