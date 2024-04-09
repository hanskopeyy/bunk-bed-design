import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-30, 20, 30);
camera.zoom = 0.9;
camera.rotation.set(0, Math.PI/4,0);
camera.updateProjectionMatrix()

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function makeWoodCube(length, width, height)
{
    const geometry = new THREE.BoxGeometry( length, width, height );
    const material = new THREE.MeshStandardMaterial( { color: 0xD7BA89 } );
    const cube = new THREE.Mesh( geometry, material );

    return cube;
}

var bed1 = makeWoodCube(16,31,3);
bed1.position.y = 1;
bed1.position.z = 1;
bed1.rotation.x = Math.PI/2;
scene.add(bed1);

var bed2 = makeWoodCube(16,30,3);
bed2.position.y = 18.5;
bed2.rotation.x = Math.PI/2;
scene.add(bed2);

var bed3 = makeWoodCube(16,26,3);
bed3.position.y = 13;
bed3.position.z = -15.5;
scene.add(bed3);

var bed4 = makeWoodCube(16,23,3);
bed4.position.y = 11.5;
bed4.position.z = 15.5;
scene.add(bed4);

var bed5 = makeWoodCube(16,10,1);
bed5.position.y = 5;
bed5.position.z = -24;
scene.add(bed5);

var bed6 = makeWoodCube(8,10,1);
bed6.position.x = 7.5;
bed6.position.y = 5;
bed6.position.z = -20;
bed6.rotation.y = Math.PI/2;
scene.add(bed6);

var bed7 = makeWoodCube(8,10,1);
bed7.position.x = -7.5;
bed7.position.y = 5;
bed7.position.z = -20;
bed7.rotation.y = Math.PI/2;
scene.add(bed7);

var bed7 = makeWoodCube(16,8,1);
bed7.position.y = 25.5;
bed7.position.z = -20;
bed7.rotation.x = Math.PI/2;
scene.add(bed7);

const geometry = new THREE.BoxGeometry( 15, 23, 11 );
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const cube_Gorou = new THREE.Mesh( geometry, material );
cube_Gorou.rotation.x = Math.PI/2;
cube_Gorou.position.y = 9;
scene.add(cube_Gorou);

const cube_Razor = new THREE.Mesh( geometry, material );
cube_Razor.rotation.x = Math.PI/2;
cube_Razor.position.y = 26.5;
scene.add(cube_Razor);

var bed7 = makeWoodCube(16,5,1);
bed7.position.z = 19;
bed7.rotation.x = Math.PI/2;
scene.add(bed7);

var bed7 = makeWoodCube(16,5,1);
bed7.position.y = 4.5;
bed7.position.z = 19;
bed7.rotation.x = Math.PI/2;
scene.add(bed7);

var bed7 = makeWoodCube(16,5,1);
bed7.position.y = 9;
bed7.position.z = 19;
bed7.rotation.x = Math.PI/2;
scene.add(bed7);

var bed7 = makeWoodCube(16,10,1);
bed7.position.z = -19.5;
bed7.rotation.x = Math.PI/2;
scene.add(bed7);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(0, 20, 10); // x, y, z
scene.add(dirLight);

function animate() {

	requestAnimationFrame( animate );

    controls.update();

	renderer.render( scene, camera );
}
animate();