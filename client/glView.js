'user strict';
window.THREE = require('three')
require('./OBJLoader');
require('./ColladaLoader');

// require('three-json-loader');
// var collada = require('three-loaders-collada')(THREE);


function GLView(_corner) {

  console.log('INIT GL VIEW')

  var corner = _corner;
  var container;
  var camera, scene, renderer;
  var cameraTarget = new THREE.Vector3(0, 0, -100);
  var cameraExtra = new THREE.Vector2(0, 0);
  var wall;
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  if (corner) {
    WIDTH = 110;
    HEIGHT = 110;
  }
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

    //Scene

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0, 1000);

    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 5000);
    camera.position.z = 150;
    camera.position.y = 0;
    camera.lookAt(cameraTarget);
    scene.add(camera);


    var loader = new THREE.JSONLoader();

    var aLight = new THREE.AmbientLight(new THREE.Color("hsl(0, 0%, 30%)"));
    scene.add(aLight);

    var pLight = new THREE.PointLight(new THREE.Color(1, 1, 1), .7, 2000);
    pLight.position.set(-100, -10, 800);
    scene.add(pLight);

    var bottomLight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.7, 100);
    bottomLight.position.set(10, 60, 10);
    scene.add(bottomLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 1, 1, -1 ).normalize();
    // scene.add( directionalLight );

    try {
      // renderer
      var options = {
        canvas: document.getElementById("webGL"),
        antialias: true,
        alpha: false,
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
      // renderer.domElement.id = 'webGLView'

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


    var trans = THREE.ImageUtils.loadTexture("/images/transparent1black.jpg",render);
    trans.wrapS = trans.wrapT = THREE.RepeatWrapping;
    var transN = THREE.ImageUtils.loadTexture("/images/transparent_NRM.png",render);
    transN.wrapS = transN.wrapT = THREE.RepeatWrapping;
    trans.repeat.set(1, 1);



    var shininess = 40,
      // diffuse = new THREE.Color(.6, .6, .6),
      specular = new THREE.Color("hsl(0, 0%, 70%)"),
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
    transMaterial.color = new THREE.Color("hsl(0, 0%, 80%)");

    var textMaterial = greyMaterial.clone()
    textMaterial.map = null;
    textMaterial.normalMap = null;
    textMaterial.metal = true;
    textMaterial.transparent = false;
    if(corner) {
      textMaterial.transparent = true;
      textMaterial.opacity = 0;
    }

    // textMaterial.color = new THREE.Color("hsl(0, 0%, 50%)");
    // textMaterial.specular = new THREE.Color("hsl(0, 0%, 30%)");
    // textMaterial.specular = new THREE.Color("hsl(0, 0%, 100%)");
    textMaterial.shininess = 60;
    textMaterial.color = new THREE.Color("rgb(215,195,0)");
    textMaterial.specular = new THREE.Color("rgb(165,125,100)");


    var sideMaterial = greyMaterial.clone()
    sideMaterial.map = null;
    sideMaterial.normalMap = null;
    sideMaterial.metal = true;
    sideMaterial.transparent = false;
    sideMaterial.color = new THREE.Color("rgb(215,195,0)");
    // sideMaterial.specular = new THREE.Color("hsl(0, 0%, 100%)");
    sideMaterial.specular = new THREE.Color("rgb(225,185,0)");
    sideMaterial.shininess = 30;


    var plane = new THREE.Mesh(planeGeometry, greyMaterial);
    plane.position.y = -100;
    plane.rotation.x = -Math.PI / 2;
    // scene.add(plane);

    wall = new THREE.Mesh(planeGeometry, texture3);
    // plane.position.y = -100;
    wall.position.z = -1000;
    // plane.rotation.y = -Math.PI / 7;
    wall.scale.set(20, 20, 20);
    if (!corner)
      scene.add(wall);


    logo = new THREE.Object3D();
    // scene.add(logo)
    logo.position.y = 10;
    var s = .4;
    // var s = .1;
    logo.scale.set(s, s, s);

    var cLoader = new THREE.ColladaLoader();

    // cLoader.load( '/3d/m_03.dae', function ( collada ) {

    //   var mesh = collada.scene;

    //   mesh.traverse( function ( child ) {

    //     if(child.material){
    //       console.log(child.material.name)
    //     }

    //   })
    // })


    var loader = new THREE.OBJLoader();
    var jLoader = new THREE.JSONLoader();
    jLoader.load('/3d/MfaceOnly.js', function (geometry) {
      var material = new THREE.MeshFaceMaterial([sideMaterial, transMaterial, sideMaterial]);
      var object = new THREE.Mesh(geometry, material);
      logo.add(object);
    })

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

    // loader.load('/3d/09_m-n.obj', function(object) {
    //   object.traverse(function(child) {
    //     if (child instanceof THREE.Mesh) {
    //       child.material = transMaterial;
    //       // child.material = new THREE.MultiMaterial(transMaterial,textMaterial,transMaterial,transMaterial);
    //     }
    //   });
    //   text = object;
    //   logo.add(text);
    // });

    render();
  }

  function onWindowResize(event) {

    if (corner) return;

    var w = window.innerWidth;
    var h = window.innerHeight;

    WIDTH = w;
    HEIGHT = w;

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

    // if (corner) {
    //   // wall.rotation.y += (.5 * mouse.x / WIDTH - wall.rotation.y) * .05;
    //   // wall.rotation.x += (.5 * mouse.y / HEIGHT - wall.rotation.x) * .05;
    //   logo.rotation.y += (.7 * mouse.x / WIDTH - logo.rotation.y) * .05;
    //   logo.rotation.x += (.7 * mouse.y / HEIGHT - logo.rotation.x) * .05;
    // }
    // else {
      camera.position.x -= (mouse.x / 10 + camera.position.x) * .05;
      camera.position.y += (- mouse.y / 10 - camera.position.y) * .05;
      camera.lookAt(scene.position);
    // }


    // controls.update();
    var optimalDivider = delta / 16;
    var smoothing = Math.max(5, (30 / optimalDivider));

    if (has_gl) {
      renderer.render(scene, camera);
    }
  }

  this.start = function() {
    stop = false;
    animate();
  }
  this.add = function() {
    scene.add(logo);
  }
  this.stop = function() {
    camera.position.x = 0;
    camera.position.y = 0;
    stop = true;
  }
  this.remove = function() {
    console.log(scene, 'scene')
    scene.remove(logo)
  }

  this.cornerState = function(_corner) {
    // corner = _corner;
    // if (corner) {
    //   var position = unproject(110, 70, 0);
    //   console.log(position);
    //   var s = .1;
    //   logo.scale.set(s, s, s);
    //   logo.position.copy(position);
    // }
    // else {
    //   var s = .4;
    //   logo.scale.set(s, s, s);
    //   logo.position.set(0, 10, 0);
    // }
  };

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

  this.dom = renderer.domElement

}

module.exports = GLView;