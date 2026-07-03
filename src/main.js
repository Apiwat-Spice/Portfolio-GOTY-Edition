import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// -------------------- Torus --------------------

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: 'red' })
);

scene.add(torus);

// -------------------- Light --------------------

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(pointLight);
scene.add(ambientLight);

// Helper
scene.add(new THREE.PointLightHelper(pointLight));
scene.add(new THREE.GridHelper(200, 50));

// Orbit
const controls = new OrbitControls(camera, renderer.domElement);

// -------------------- Stars --------------------

function addStar() {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);

  scene.add(star);
}

Array(200).fill().forEach(addStar);

// -------------------- Background --------------------

const loader = new THREE.TextureLoader();

scene.background = loader.load('/SpaceBG.png');

// -------------------- Box --------------------

const box = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    map: loader.load('/space.jpg'),
  })
);

box.position.set(-8, 0, 0);

scene.add(box);

const moonTexture = loader.load(
  '/moon.jpg',
  (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    console.log('Moon Loaded');
  },
  undefined,
  (err) => console.error(err)
);

const normalTexture = loader.load(
  '/normal3.png', 
  () => console.log('Normal Loaded'),
  undefined,
  (err) => console.error(err)
);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 1,
    metalness: 0,
  })
);

moon.position.set(8, 0, 0);

scene.add(moon);

// -------------------- Animate --------------------

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.y += 0.003;

  controls.update();

  renderer.render(scene, camera);
}

animate();

// -------------------- Resize --------------------

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});