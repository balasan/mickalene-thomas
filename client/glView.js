'user strict';
window.THREE = require('three/three.min.js')
require('./OBJLoader');
// require('./ColladaLoader');


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

    // var img = new Image();
    // img.src = "/images/collage.jpg";

    // imgTexture = THREE.ImageUtils.loadTexture("/images/collage.jpg",null,render);
    // imgTexture = THREE.ImageUtils.loadTexture("/images/sparkle.jpg",null,render);
    imgTexture = THREE.ImageUtils.loadTexture("/images/glitter-sq.jpg",null,render);
    imgTexture.wrapS = THREE.RepeatWrapping;
    imgTexture.wrapT = THREE.RepeatWrapping;

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
    transMaterial.map = imgTexture;
    // updateTextureAspect();
    transMaterial.normalMap = imgTexture;

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