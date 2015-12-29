'user strict';
window.THREE = require('three')
require('./OBJLoader');

// require('three-json-loader');
// var collada = require('three-loaders-collada')(THREE);


function GLView() {

  console.log('INIT GL VIEW')

  var container;
  var camera, scene, renderer;
  var cameraTarget = new THREE.Vector3(0, 0, -100);
  var cameraExtra = new THREE.Vector2(0, 0);

  var controls;

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

    // container = document.body;

    // container = document.createElement('div');
    // document.body.appendChild(container);

    //Scene

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0, 1000);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 150;
    camera.position.y = 0;
    camera.lookAt(cameraTarget);
    scene.add(camera);


    // controls = new THREE.OrbitControls(camera, container);
    // controls.minDistance = 10;
    // controls.minY = -200;
    // controls.maxDistance = 3500;
    // controls.noPan = true;
    // controls.damping = 0.1;
    // controls.position = camera.position.clone();
    // controls.target = cameraTarget.clone();





    // tree
    var loader = new THREE.JSONLoader();
    // loader.load( "tree.js", treeLoaded );
    // loader.load( "butterfly.js", butterflyLoaded );

    var aLight = new THREE.AmbientLight(new THREE.Color("hsl(0, 0%, 50%)"));
    scene.add(aLight);

    var pLight = new THREE.PointLight(new THREE.Color(1, 1, 1), .7, 2000);
    pLight.position.set(-100, -10, 900);
    scene.add(pLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 1, 1, -1 ).normalize();
    // scene.add( directionalLight );

    try {
      // renderer
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webGL'),
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

      renderer.setSize(window.innerWidth, window.innerHeight);

      // renderer.setClearColor(scene.fog.color);

      renderer.sortObjects = false;
      renderer.domElement.id = 'webGLView'

      // container.appendChild(renderer.domElement);
      has_gl = true;

      document.addEventListener('mousemove', onMouseMove, false);
      // document.addEventListener('touchmove', onTouchMove, false);
      window.addEventListener('resize', onWindowResize, false);

    } catch (e) {
      // need webgl
      document.getElementById('info').innerHTML = "<P><BR><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>For example. <a href='http://www.google.com/landing/chrome/beta/' target='_blank'>Google Chrome 9+</a> or <a href='http://www.mozilla.com/firefox/beta/' target='_blank'>Firefox 4+</a>.<BR><BR>If you are already using one of those browsers and still see this message, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.</P><CENTER><BR><img src='../general/WebGL_logo.png' border='0'></CENTER>";
      document.getElementById('info').style.display = 'block';
      return;
    }


    var bg2 = THREE.ImageUtils.loadTexture("/images/t4.jpg",null, render);
    bg2.wrapS = bg2.wrapT = THREE.RepeatWrapping;
    bg2.repeat.set(5, 5);
    var bg2N = THREE.ImageUtils.loadTexture("/images/bg2_NRM.jpg",null,render);
    bg2N.wrapS = bg2N.wrapT = THREE.RepeatWrapping;
    bg2N.repeat.set(5, 5);


    var trans = THREE.ImageUtils.loadTexture("/images/transparent1.png",render);
    trans.wrapS = trans.wrapT = THREE.RepeatWrapping;
    var transN = THREE.ImageUtils.loadTexture("/images/transparent_NRM.png",render);
    transN.wrapS = transN.wrapT = THREE.RepeatWrapping;
    trans.repeat.set(1, 1);



    var shininess = 40,
      // diffuse = new THREE.Color(.6, .6, .6),
      specular = new THREE.Color("hsl(0, 0%, 50%)"),
      normalScale = new THREE.Vector2(0, 1),
      shading = THREE.SmoothShading;

    var planeGeometry = new THREE.PlaneGeometry(400, 400);
    var greyMaterial = new THREE.MeshPhongMaterial({
      map: bg2,
      normalMap: bg2N,
      normalScale: normalScale,
      color: new THREE.Color("hsl(0, 0%, 100%)"),
      specular: specular,
      // diffuse: diffuse,
      transparent: true,
      shininess: shininess,
      shading: shading
    });




    var texture3 = greyMaterial.clone()
    texture3.map = bg2;
    texture3.normalMap = bg2N;
    texture3.shininess = 20;
    texture3.normalScale = new THREE.Vector2(0, 1);


   transMaterial = greyMaterial.clone()
    transMaterial.map = trans;
    transMaterial.normalMap = transN;
    // transMaterial.metal = true;
    transMaterial.specular = new THREE.Color("hsl(0, 0%, 30%)");

    var textMaterial = greyMaterial.clone()
    textMaterial.map = null;
    textMaterial.normalMap = null;
    // textMaterial.metal = true;
    textMaterial.transparent = false;
    textMaterial.color = new THREE.Color("hsl(0, 0%, 50%)");
    textMaterial.specular = new THREE.Color("hsl(0, 0%, 30%)");

    var plane = new THREE.Mesh(planeGeometry, greyMaterial);
    plane.position.y = -100;
    plane.rotation.x = -Math.PI / 2;
    // scene.add(plane);

    var plane = new THREE.Mesh(planeGeometry, texture3);
    // plane.position.y = -100;
    plane.position.z = -1000;
    // plane.rotation.y = -Math.PI / 7;
    plane.scale.set(20, 20, 20);
    scene.add(plane);


    logo = new THREE.Object3D();
    // scene.add(logo)
    logo.position.y = 10;
    var s = .4;
    logo.scale.set(s, s, s);

    var loader = new THREE.OBJLoader();
    loader.load('/3d/M.obj', function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = transMaterial;
        }
      });
      // console.log(object, 'object')
      M = object;
      logo.add(M);
    });

    loader.load('/3d/text.obj', function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = textMaterial;
          console.log(child)
        }
      });
      // console.log(object, 'object')
      text = object;
      logo.add(text);
    });



    render();
  }

  function onWindowResize(event) {

    var w = window.innerWidth;
    var h = window.innerHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

  }



  function onMouseMove(event) {

    // event.preventDefault();
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.x = (event.clientX - window.innerWidth/2);
    mouse.y = -(event.clientY - window.innerHeight/2);


  }

  function onTouchMove(event) {

    // event.preventDefault();

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

    camera.position.x += (mouse.x / 10 - camera.position.x) * .05;
    camera.position.y += (- mouse.y / 10 - camera.position.y) * .05;
    camera.lookAt(scene.position);

    // controls.update();
    var optimalDivider = delta / 16;
    var smoothing = Math.max(5, (30 / optimalDivider));

    if (has_gl) {
      renderer.render(scene, camera);
    }
  }

  this.start = function(){
    stop = false;
    animate();
  }
  this.add = function(){
    scene.add(logo);
  }
  this.stop = function(){
    stop = true;
  }
  this.remove = function() {
    console.log(scene, 'scene')
    scene.remove(logo)
  }
  this.dom = renderer.domElement

}

module.exports = GLView;