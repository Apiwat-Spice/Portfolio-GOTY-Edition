import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three';
import { array } from 'three/src/nodes/core/ArrayNode.js';
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const loader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
const geometry = new THREE.TorusGeometry(10,3,16,100)
const meterial = new THREE.MeshStandardMaterial({color:'red'})
const torus = new THREE.Mesh(geometry,meterial);

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientlight =  new THREE.AmbientLight(0xffffff)
scene.add(pointLight,ambientlight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

const controls = new OrbitControls(camera,renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24)
  const meterial = new THREE.MeshStandardMaterial({color:0xffffff})
  const star = new THREE.Mesh(geometry,meterial)

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
  
  star.position.set(x,y,z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)
const spaceTexture = new THREE.TextureLoader().load('SpaceBG.png') 
scene.background = spaceTexture;

const boxTexture = new THREE.TextureLoader().load('space.jpg')

const box = new THREE.Mesh (
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:boxTexture})
);

scene.add(box)

const texture = loader.load('/moon.jpg');
const normal = loader.load('/normal2.jpg');

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: normal
  })
);

scene.add(sphere);

function animate(){ 
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01 
  torus.rotation.y += 0.005 
  torus.rotation.z += 0.01 
  controls.update();
  renderer.render(scene,camera);
}
animate()