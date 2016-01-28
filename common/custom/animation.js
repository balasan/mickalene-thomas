
function Animation(params){
  this.inContainer = params.newContainer;
  this.outContainer = params.oldContainer;
  this.delay = params.delay;
  this.dispatch = params.dispatch;
  this.renderFunction = params.renderFunction;
  this.class = params.class;
}

Animation.prototype.animateIn = function( items){
  var self = this;
  this.inContainer.innerHTML = "";
  items.forEach(function(item){
    var el = self.renderFunction(item, self.dispatch);
    self.inContainer.appendChild(el);
  })
}

Animation.prototype.animateOut = function(delay){

    var self = this;

    this.outContainer.innerHTML = this.inContainer.innerHTML;
    this.inContainer.innerHTML = ""
    var els = this.outContainer.getElementsByTagName('span');

    // if(!els.length) return;
    var i = els.length
    while (i--) {
      var el = els[i].getElementsByTagName('a')[0]
      clearClass(el, self.class + '-enter');
      el.className += " " + self.class + "-leave";
      leaveActive(el);
    }

    setTimeout( function(){
      var i = els.length
      while (i--) {
        var el = els[i]
        try{
          self.outContainer.removeChild(el);
        } catch(err){}
      }
    }, delay)

    function leaveActive(el){
      setTimeout(function(){
        el.className += " " + self.class + "-leave-active";
      },10);
    }

    function clearClass(el, prefix){
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = classes.join(" ").trim();
    }
}


export default Animation;