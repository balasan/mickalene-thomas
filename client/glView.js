'user strict';
window.THREE = require('three/three.min.js')
require('./OBJLoader');
// require('./ColladaLoader');

var mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function GLView(_corner) {

  var corner = _corner;
  var container;
  var camera, scene, renderer;
  var cameraTarget = new THREE.Vector3(0, 0, -100);
  var cameraExtra = new THREE.Vector2(0, 0);
  var wall;
  var videoTexture, imgTexture;
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  if (corner) {
    WIDTH = 110;
    HEIGHT = 110;
  }
  var controls;
  var video;

  var mouse = new THREE.Vector2(0, 0);
  var uniforms;

  var delta;
  var transMaterial;
  var scene;
  var object;
  var time;
  var M;
  var text;
  var logo;
  var oldTime;
  var M;

  var loadedItems = 0;

  var stats;
  var has_gl = false;

  var stop = true;

  function addStats() {
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.prependChild(stats.domElement);
  }

  init();

  function checkLoading() {

    ++loadedItems;

    if (loadedItems >= 0) {
      // animate();

      //   var alphaTween = new TWEEN.Tween(bgSprite.material)
      //     .to({opacity: 0}, 3000)
      //     .easing(TWEEN.Easing.Cubic.In)
      //     .onComplete(function () {
      //       camera.remove( bgSprite );
      //     });
      //   alphaTween.start();
    }
  }


  function init() {

    //Scene

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0, 1000);

    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 5000);
    camera.position.z = 150;
    camera.position.y = 0;
    camera.lookAt(cameraTarget);
    scene.add(camera);


    // var loader = new THREE.JSONLoader();

    var aLight = new THREE.AmbientLight(new THREE.Color("hsl(0, 0%, 100%)"));
    scene.add(aLight);

    try {
      // renderer
      var options = {
        canvas: document.getElementById("webGL"),
        antialias: true,
        alpha: true,
      }
      if(corner) {
        options = {
          canvas: document.getElementById("webGLCorner"),
          antialias: true,
          alpha: true,
        }
      }

      renderer = new THREE.WebGLRenderer(options);

      renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

      renderer.setSize(WIDTH, HEIGHT);

      // renderer.setClearColor(scene.fog.color);

      renderer.sortObjects = false;

      has_gl = true;

      document.addEventListener('mousemove', onMouseMove, false);
      // document.addEventListener('touchmove', onTouchMove, false);
      window.addEventListener('resize', onWindowResize, false);
      window.addEventListener('DOMContentLoaded', onWindowResize, false);
      window.addEventListener('load', onWindowResize, false);

    } catch (e) {
      // need webgl
      // handle no webgl
      // document.getElementById('info').innerHTML = "<P><BR><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>For example. <a href='http://www.google.com/landing/chrome/beta/' target='_blank'>Google Chrome 9+</a> or <a href='http://www.mozilla.com/firefox/beta/' target='_blank'>Firefox 4+</a>.<BR><BR>If you are already using one of those browsers and still see this message, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.</P><CENTER><BR><img src='../general/WebGL_logo.png' border='0'></CENTER>";
      // document.getElementById('info').style.display = 'block';
      document.getElementById('nowebgl').className='bg';
      document.getElementById('webGL').className='hidden';
      return;
    }


    video = document.getElementById("vidPattern");
    videoTexture = new THREE.Texture( video );

    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.minFilter = THREE.LinearFilter;

    if(mobilecheck()){
      imgTexture = THREE.ImageUtils.loadTexture("/images/glitter-sq.jpg",null,render);
      imgTexture.wrapS = THREE.RepeatWrapping;
      imgTexture.wrapT = THREE.RepeatWrapping;
    }


    var shininess = 30,
      // diffuse = new THREE.Color(.6, .6, .6),
      specular = new THREE.Color("hsl(0, 0%, 70%)"),
      normalScale = new THREE.Vector2(0, 1),
      shading = THREE.SmoothShading;

    var planeGeometry = new THREE.PlaneGeometry(400, 400);
    var greyMaterial = new THREE.MeshPhongMaterial({
      // map: bg2,
      // normalMap: bg2N,
      normalScale: normalScale,
      color: new THREE.Color("hsl(0, 0%, 100%)"),
      specular: specular,
      // diffuse: diffuse,
      transparent: true,
      shininess: shininess,
      shading: shading
    });


    transMaterial = greyMaterial.clone()

    if(mobilecheck())
      transMaterial.map = imgTexture;
    else
      transMaterial.map = videoTexture;
    // updateTextureAspect();
    // transMaterial.normalMap = imgTexture;

    transMaterial.normalMap = null;

    transMaterial.metal = false;
    //FLOWER PATTER
    transMaterial.specular = new THREE.Color("hsl(0, 0%, 30%)");
    transMaterial.color = new THREE.Color("hsl(0, 0%, 80%)");

    //COLLAGE PATTERS
    transMaterial.specular = new THREE.Color("hsl(0, 0%, 30%)");
    transMaterial.color = new THREE.Color("hsl(0, 0%, 100%)");

    var textMaterial = greyMaterial.clone()
    textMaterial.map = null;
    textMaterial.normalMap = null;
    textMaterial.metal = true;
    textMaterial.transparent = false;
    if(corner) {
      textMaterial.transparent = true;
      textMaterial.opacity = 0;
    }

    textMaterial.shininess = 40;
    textMaterial.color = new THREE.Color("hsl(0, 0%, 100%)");
    textMaterial.specular = new THREE.Color("hsl(0, 0%, 100%)");



    logo = new THREE.Object3D();
    M = new THREE.Object3D();
    logo.position.y = 10;

    var loader = new THREE.OBJLoader();

    var mObj = "/3d/M.obj";

    loader.load(mObj, function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = transMaterial;
        }
      });
      M = object;
      logo.add(object);
    });

    loader.load('/3d/text.obj', function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = textMaterial;
        }
      });
      text = object;
      logo.add(text);
    });


    onWindowResize()
    if(has_gl)
      render();
  }

  function updateTextureAspect(video){

    if(video){
      var tabletAspect = 1;
      var videoAspect = 16/9;

      transMaterial.map.repeat.x = tabletAspect/videoAspect
      transMaterial.map.offset.x = (1-tabletAspect/videoAspect) * 1/2
    }
    else{
      var tabletAspect = 1;
      var videoAspect =  1743/1629;

      transMaterial.map.repeat.x = tabletAspect/videoAspect
      transMaterial.map.offset.x = (1-tabletAspect/videoAspect) * 1/2
    }
  }

  function onWindowResize(event) {

    var w = window.innerWidth;
    var h = window.innerHeight;

    WIDTH = w;
    HEIGHT = w;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    var s = .4;

    if (w < 900){
      s= .25;
    }
    if(h < 700){
      s = .25;
    }

    logo.scale.set(s, s, s);
  }



  function onMouseMove(event) {
    mouse.x = (event.clientX - window.innerWidth/2);
    mouse.y = -(event.clientY - window.innerHeight/2);
  }

  function onTouchMove(event) {

    for (var i = 0; i < event.changedTouches.length; i++) {

      var tx = (event.changedTouches[i].clientX / window.innerWidth) * 2 - 1;
      var ty = -(event.changedTouches[i].clientY / window.innerHeight) * 2 + 1;

      mouse.x = tx;
      mouse.y = ty;

    }

  }



  function animate() {
    if (stats)
      stats.update();
    render(delta);
    if(!stop)
      window.requestAnimationFrame(animate);
  }

  function render(delta) {


    time = Date.now();
    delta = time - oldTime;
    oldTime = time;
    if (isNaN(delta) || delta > 1000 || delta == 0) {
      delta = 1000 / 60;
    }

    if(transMaterial.map != videoTexture){
      transMaterial.map.offset.x += delta * .00002;
      transMaterial.map.offset.y -= delta * .00001;
    }

    if (window.location.hash == "#alt") {
      camera.position.x -= (mouse.x / 15 + camera.position.x) * .05;
      camera.position.y += (- mouse.y / 15 - camera.position.y) * .05;
      camera.lookAt(scene.position);
    }


    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
      if ( videoTexture ) videoTexture.needsUpdate = true;
      if (transMaterial.map != videoTexture) {
        transMaterial.map = videoTexture;
        updateTextureAspect(true);
      }
    }
    var optimalDivider = delta / 16;
    var smoothing = Math.max(5, (30 / optimalDivider));

    if (has_gl) {
      renderer.render(scene, camera);
    }
  }

  this.start = function() {
    stop = false;
    if(has_gl) animate();
  }
  this.add = function() {
    if(has_gl)
      scene.add(logo);
    else{
      document.getElementById('nowebgl').className='bg';
    }
  }
  this.stop = function() {
    camera.position.x = 0;
    camera.position.y = 0;
    stop = true;
  }
  this.remove = function() {
    if(has_gl)
      scene.remove(logo)
    else{
       document.getElementById('nowebgl').className='bg hidden';
    }
  }


  function unproject(x, y, z) {
    var vector = new THREE.Vector3();

    vector.set(
        (x / window.innerWidth) * 2 - 1,
        - (y / window.innerHeight) * 2 + 1,
        -.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
  }

  if(renderer)
    this.dom = renderer.domElement
  else
    this.dom = null;

  this.has_gl = has_gl;
}

module.exports = GLView;