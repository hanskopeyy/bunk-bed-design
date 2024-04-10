import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.138.3/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.138.3/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'; 

// --------------------- Variables ------------------
let SCENE
let PERSPECTIVE_CAMERA
let PERSPECTIVE_CAMERA_CONTROL
let FONT_LOADER = new FontLoader();
let MODEL_LOADER = new GLTFLoader();
let RENDERER
let OBJECT_GROUP = [];
let SIZE_GROUP = [];
let IS_SIZE_SHOWN = false;

// --------------------- Create ---------------------
let createPerspectiveCamera = () => {
    let fov = 75

    let w = window.innerWidth
    let h = window.innerHeight
    let aspect =  w/h
    
    return new THREE.PerspectiveCamera(fov, aspect)
}

let createWoodCube = (properties) => {
    const geometry = new THREE.BoxGeometry( properties.width, properties.height, properties.length );
    const material = new THREE.MeshStandardMaterial( { color: 0xD7BA89 } );
    const cube = new THREE.Mesh( geometry, material );

    cube.position.set(properties.x, properties.y, properties.z);
    cube.rotation.set(properties.rotateX, properties.rotateY, properties.rotateZ);
    
    return cube;
}

let createLine = (properties, color = 0xFFFFFF, isLine = true) => {
    const geometry = new THREE.BoxGeometry( properties.width, properties.height, properties.length );
    const material = new THREE.MeshStandardMaterial( { color: color } );
    let lineGroup = new THREE.Group();
    const cube = new THREE.Mesh( geometry, material );

    cube.rotation.set(0, 0, 0);
    lineGroup.add(cube);
    
    if(isLine)
    {
    const geometry2 = new THREE.BoxGeometry( properties.height, properties.length, properties.length*3 );
    const cube2 = new THREE.Mesh( geometry2, material );
    cube2.position.set(0 - (properties.width/2) + (properties.height), 0, 0);
    cube2.rotation.set(0, 0, Math.PI/2);
    lineGroup.add(cube2);
    
    const geometry3 = new THREE.BoxGeometry( properties.height, properties.length, properties.length*3 );
    const cube3 = new THREE.Mesh( geometry3, material );
    cube3.position.set((properties.width/2) - (properties.height), 0, 0);
    cube3.rotation.set(0, 0, Math.PI/2);
    lineGroup.add(cube3);
}
    lineGroup.position.set(properties.x, properties.y, properties.z);
    lineGroup.rotation.set(properties.rotateX, properties.rotateY, properties.rotateZ);
    return lineGroup;
}

let createText = (scene, text, properties, color = 0xFFFFFF) => {
    FONT_LOADER.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (typefont) => {
        let geometry = new TextGeometry(text, {
            font: typefont,
            depth: properties.height,
            size: properties.size
        });
        geometry.center();
        let material = new THREE.MeshStandardMaterial({
            color: color
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(properties.x, properties.y, properties.z);
        mesh.rotation.set(properties.rotateX, properties.rotateY, properties.rotateZ);

        scene.add(mesh);
        SIZE_GROUP.push(mesh);
    })
};

let createLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);
}

let createModel = (scene, assetsName, y) => {
    MODEL_LOADER.load('./assets/' + assetsName, (obj) => {
        let mesh = obj.scene
        mesh.scale.set(600,700,900)
        mesh.rotation.x = Math.PI/180 * (-70)
        mesh.position.set(0,y,0)
        scene.add(mesh)
    })
}

function toggleSizes(){
    if(!IS_SIZE_SHOWN){
        for (let e of SIZE_GROUP){
            if(e == null)
                continue;

            if(e.parent !== SCENE)
                SCENE.add(e);
        }
        IS_SIZE_SHOWN = true;
    } else {
        SIZE_GROUP.forEach(e => {
            SCENE.remove(e);
        })
        IS_SIZE_SHOWN = false;
    }
}

// --------------------- init  ----------------------
let init = () => {
    SCENE = new THREE.Scene();
    PERSPECTIVE_CAMERA = createPerspectiveCamera();
    
    PERSPECTIVE_CAMERA.position.set(-30, 50, 30);
    PERSPECTIVE_CAMERA.rotation.set(0, Math.PI/4,0);
    PERSPECTIVE_CAMERA.updateProjectionMatrix();

    RENDERER = new THREE.WebGLRenderer()
    RENDERER.antialias = true
    RENDERER.setSize(window.innerWidth, window.innerHeight)
    RENDERER.setClearColor(0x303030)
    RENDERER.shadowMap.enabled = true

    PERSPECTIVE_CAMERA_CONTROL = new OrbitControls( PERSPECTIVE_CAMERA, RENDERER.domElement );
    
    // Main Bed Frame
    OBJECT_GROUP.push(createWoodCube({
        width: 16, height: 30,length: 3,
        x: 0, y: 1, z: 0,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 30, length: 3,
        x: 0, y: 19, z: 0,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 26, length: 3,
        x: 0, y: 12.5, z: -16.5,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 23, length: 3,
        x: 0, y: 11, z: 16.5,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }));

    // Main Bed Frame sizes
    SIZE_GROUP.push(createText(SCENE, "16 cm", {
        height: 0.25, size: 2,
        x: 0, y: -0.125, z: 27,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 16, height: 0.25, length: 0.5,
        x: 0, y: -0.125, z: 25,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createText(SCENE, "23 cm", {
        height: 0.25, size: 2,
        x: 13.25, y: 12.5, z: 18,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 23, height: 0.25, length: 0.5,
        x: 8.75, y: 11, z: 18,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "26 cm", {
        height: 0.25, size: 2,
        x: -13.75, y: 14, z: -16.5,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 26, height: 0.25, length: 0.5,
        x: -8.625, y: 12.5, z: -16.5,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, " 3 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 14, z: 16.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: Math.PI/2
    }), createLine ({
        width: 3, height: 0.25, length: 0.5,
        x: -8.125, y: 10, z: 16.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: Math.PI/2
    }), createText(SCENE, " 30 cm", {
        height: 0.25, size: 2,
        x: -5.125, y: 20.125, z: 0,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: -Math.PI/2
    }), createLine ({
        width: 30, height: 0.25, length: 0.5,
        x: -7.125, y: 20.125, z: 0,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, " 30 cm", {
        height: 0.25, size: 2,
        x: -5.125, y: 2.625, z: 0,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: -Math.PI/2
    }), createLine ({
        width: 30, height: 0.25, length: 0.5,
        x: -7.125, y: 2.625, z: 0,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "15 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 10, z: -8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 15, height: 0.25, length: 0.5,
        x: -8.125, y: 10, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFF3030), createText(SCENE, "3 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 19, z: -8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 3, height: 0.25, length: 0.5,
        x: -8.125, y: 19, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }), createText(SCENE, "3 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 1, z: -8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 3, height: 0.25, length: 0.5,
        x: -8.125, y: 1, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }), createText(SCENE, "5 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 23, z: -8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    },0xFF3030), createLine ({
        width: 5, height: 0.25, length: 0.5,
        x: -8.125, y: 23, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    },0xFF3030), createText(SCENE, "2 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 21.5, z: 8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    },0xFF3030), createLine ({
        width: 2, height: 0.25, length: 0.5,
        x: -8.125, y: 21.5, z: 13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    },0xFF3030));
    
    // Side Storage
    OBJECT_GROUP.push(createWoodCube({
        width: 16, height: 8, length: 1,
        x: 0, y: 6, z: -24.5,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 6, height: 8, length: 1,
        x: 7.5, y: 6, z: -21,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: 0
    }), createWoodCube({
        width: 6, height: 8, length: 1,
        x: -7.5, y: 6, z: -21,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 8, length: 3,
        x: 0, y: 1, z: -21,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }));

    // Side Storage sizes
    SIZE_GROUP.push(createText(SCENE, "6 cm", {
        height: 0.25, size: 2,
        x: 2.125, y: 10.125, z: -21,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }), createLine ({
        width: 6, height: 0.25, length: 0.5,
        x: 6.125, y: 10.125, z: -21,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFFFFFF, false),createText(SCENE, "1 cm", {
        height: 0.25, size: 1.5,
        x: 2.625, y: 10.125, z: -24.25,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }, 0xFF3030), createLine ({
        width: 1, height: 0.25, length: 0.5,
        x: 6.125, y: 10.125, z: -24.5,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030, false), createText(SCENE, "10.5 cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 4.75, z: -31.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 10.5, height: 0.25, length: 0.5,
        x: -8.125, y: 4.75, z: -26.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }), createText(SCENE, "9cm", {
        height: 0.25, size: 2,
        x: -8.125, y: 5.5, z: -21.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 9, height: 0.25, length: 0.5,
        x: -8.125, y: 5.5, z: -25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "1.5 cm", {
        height: 0.25, size: 1.5,
        x: -8.125, y: 0.5, z: -21.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 1.5, height: 0.25, length: 0.5,
        x: -8.125, y: 0.25, z: -25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFF3030, false))

    // Doll
    createModel(SCENE, "doll.glb", 6);
    createModel(SCENE, "doll.glb", 24.5);

    // Shoes Holder
    OBJECT_GROUP.push(createWoodCube({
        width: 16, height: 5, length: 1,
        x: 0, y: 0, z: 20.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 5, length: 1,
        x: 0, y: 5, z: 20.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 5, length: 1,
        x: 0, y: 10, z: 20.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }))

    // Shoes Holder Sizes
    SIZE_GROUP.push(createText(SCENE, "5 cm", {
        height: 0.25, size: 2,
        x: 2.125, y: 10.625, z: 20.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 5, height: 0.25, length: 0.5,
        x: 7.125, y: 10.625, z: 20.5,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "4 cm", {
        height: 0.25, size: 2,
        x: 4.5, y: 2.5, z: 23.125,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 4, height: 0.25, length: 0.5,
        x: 0, y: 2.5, z: 23.125,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "4 cm", {
        height: 0.25, size: 2,
        x: 4.5, y: 7.5, z: 23.125,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 4, height: 0.25, length: 0.5,
        x: 0, y: 7.5, z: 23.125,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "1 cm", {
        height: 0.25, size: 1,
        x: -2.25, y: 5, z: 23.125,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 1, height: 0.25, length: 0.5,
        x: 0, y: 5, z: 23.125,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030, false), createText(SCENE, "1 cm", {
        height: 0.25, size: 1,
        x: -2.25, y: 0, z: 23.125,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 1, height: 0.25, length: 0.5,
        x: 0, y: 0, z: 23.125,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030, false), createText(SCENE, "1 cm", {
        height: 0.25, size: 1,
        x: -2.25, y: 10, z: 23.125,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 1, height: 0.25, length: 0.5,
        x: 0, y: 10, z: 23.125,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030, false))

    // Upper Display
    OBJECT_GROUP.push(createWoodCube({
        width: 16, height: 8, length: 1,
        x: 0, y: 25, z: -21,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }))

    // Upper Display Sizes
    SIZE_GROUP.push(createText(SCENE, "7 cm", {
        height: 0.25, size: 2,
        x: 2.125, y: 25.625, z: -21.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }), createLine ({
        width: 7, height: 0.25, length: 0.5,
        x: 7.125, y: 25.625, z: -21.5,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "3 cm", {
        height: 0.25, size: 2,
        x: 2.125, y: 25.625, z: -16.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }, 0xFF3030), createLine ({
        width: 3, height: 0.25, length: 0.5,
        x: 7.125, y: 25.625, z: -16.5,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030))

    createLight();
    OBJECT_GROUP.forEach(e => {
        try {
            SCENE.add(e);
        }
        catch {
            console.log(e);
        }
    });
    toggleSizes();

    document.body.appendChild( RENDERER.domElement );
    var object = document.getElementById("btn_size");
    object.addEventListener("click", toggleSizes);
}

function render() {
	requestAnimationFrame( render );
	RENDERER.render( SCENE, PERSPECTIVE_CAMERA );
}

window.onload = () => {
    init()
    render()
}
