import React, { Component, PropTypes } from 'react';
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const About = () => {
  return (
    <div>
        <section className='aboutImg'>
          <img src='/images/down_arrow.png' />
        </section>
        <section className='aboutTxt'>
        <h1>New York-based artist Mickalene Thomas is best known for her elaborate paintings composed of rhinestones, acrylic and enamel.</h1>
{/*         <p>"Thomas introduces a complex vision of what it means to be a woman and expands common
definitions of beauty. Her work stems from her long study of art history and the classical genres
of portraiture, landscape, and still life.\n\nInspired by various sources that range from the 19th century hudson river school to édouard manet, henri matisse and romare bearden, she continues to explore notions of beauty from a contemporary perspective infused with the more recent influences of popular culture and pop art.\n\nShe is represented by Lehmann Maupin in New York, Susanne Vielmetter Los Angeles Projects and Galerie Nathalie Obadia in Paris."</p> */}
<p>{'Thomas introduces a complex vision of what it means to be a woman and expands common definitions of beauty. Her work stems from her long study of art history and the classical genres of portraiture, landscape, and still life.\n\nInspired by various sources that range from the 19th century hudson river school to édouard manet, henri matisse and romare bearden, she continues to explore notions of beauty from a contemporary perspective infused with the more recent influences of popular culture and pop art.\n\nShe is represented by Lehmann Maupin in New York, Susanne Vielmetter Los Angeles Projects and Galerie Nathalie Obadia in Paris.'}</p>
        </section>
        </div>
  );
}

export default About