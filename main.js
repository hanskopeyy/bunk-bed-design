import * as THREE from './three.js/build/three.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'; 

// --------------------- Variables ------------------
let SCENE
let PERSPECTIVE_CAMERA
let PERSPECTIVE_CAMERA_CONTROL
let FONT_LOADER = new THREE.FontLoader();
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
    FONT_LOADER.load('./three.js/examples/fonts/helvetiker_regular.typeface.json', (typefont) => {
        let geometry = new THREE.TextGeometry(text, {
            font: typefont,
            height: properties.height,
            size: properties.size
        });
        geometry.center();
        let material = new THREE.MeshStandardMaterial({
            color: color
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(properties.x, properties.y, properties.z);
        mesh.rotation.set(properties.rotateX, properties.rotateY, properties.rotateZ);

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
        width: 16, height: 30,length: 1.8,
        x: 0, y: 0.4, z: 0,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 30, length: 1.8,
        x: 0, y: 17.2, z: 0,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 25, length: 1.8,
        x: 0, y: 12, z: -15.9,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 20, length: 1.8,
        x: 0, y: 9.5, z: 15.9,
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
    }), createText(SCENE, "20 cm", {
        height: 0.25, size: 2,
        x: 13.25, y: 9.5, z: 15.9,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 20, height: 0.25, length: 0.5,
        x: 8.75, y: 9.5, z: 15.9,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "25 cm", {
        height: 0.25, size: 2,
        x: -13.9, y: 12, z: -15.9,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 25, height: 0.25, length: 0.5,
        x: -9, y: 12, z: -15.9,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, " 1.8 cm", {
        height: 0.25, size: 1,
        x: -8.225, y: 14, z: 15.9,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: Math.PI/2
    }), createLine ({
        width: 1.8, height: 0.25, length: 0.5,
        x: -8.225, y: 10, z: 15.9,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, " 30 cm", {
        height: 0.25, size: 2,
        x: -5.225, y: 1.425, z: 0,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: -Math.PI/2
    }), createLine ({
        width: 30, height: 0.25, length: 0.5,
        x: -7.225, y: 1.425, z: 0,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "15 cm", {
        height: 0.25, size: 2,
        x: -8.225, y: 8.8, z: -8.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 15, height: 0.25, length: 0.5,
        x: -8.225, y: 8.8, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFF3030), createText(SCENE, "1.8 cm", {
        height: 0.25, size: 1,
        x: -8.225, y: 17.2, z: -10.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 1.8, height: 0.25, length: 0.5,
        x: -8.225, y: 17.2, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "1.8 cm", {
        height: 0.25, size: 1,
        x: -8.225, y: 0.4, z: -10.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 1.8, height: 0.25, length: 0.5,
        x: -8.225, y: 0.4, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "6.4 cm", {
        height: 0.25, size: 2,
        x: -8.225, y: 21.3, z: -8,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    },0xFF3030), createLine ({
        width: 6.4, height: 0.25, length: 0.5,
        x: -8.225, y: 21.3, z: -13.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    },0xFF3030), createText(SCENE, "1.4 cm", {
        height: 0.25, size: 1,
        x: -8.225, y: 18.8, z: 11.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    },0xFF3030), createLine ({
        width: 1.4, height: 0.25, length: 0.5,
        x: -8.225, y: 18.8, z: 14.25,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    },0xFF3030, false));
    
    // Side Storage
    OBJECT_GROUP.push(createWoodCube({
        width: 14.8, height: 6, length: 0.6,
        x: 0, y: 3.7, z: -26.5,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 10, height: 6, length: 0.6,
        x: 7.7, y: 3.7, z: -21.8,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: 0
    }), createWoodCube({
        width: 10, height: 6, length: 0.6,
        x: -7.7, y: 3.7, z: -21.8,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 10, length: 1.2,
        x: 0, y: 0.1, z: -21.8,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }));

    // Side Storage sizes
    SIZE_GROUP.push(createText(SCENE, "14.8 cm", {
        height: 0.25, size: 1.5,
        x: 0, y: 6.825, z: -25.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }), createLine ({
        width: 14.8, height: 0.5, length: 0.5,
        x: 0, y: 6.825, z: -23.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }, 0xFFFFFF, false),createText(SCENE, "0.6", {
        height: 0.25, size: 1,
        x: -7.7, y: 6.825, z: -25.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }, 0xFF3030), createLine ({
        width: 0.6, height: 0.5, length: 0.5,
        x: -7.7, y: 6.825, z: -23.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }, 0xFF3030, false),createText(SCENE, "0.6", {
        height: 0.25, size: 1,
        x: 7.7, y: 6.825, z: -25.5,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: Math.PI
    }, 0xFF3030), createLine ({
        width: 0.6, height: 0.5, length: 0.5,
        x: 7.7, y: 6.825, z: -23.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }, 0xFF3030, false), createText(SCENE, "7.2 cm", {
        height: 0.25, size: 1.5,
        x: -4.5, y: 3.1, z: -26.925,
        rotateX: 0, rotateY: -Math.PI, rotateZ: 0
    }), createLine ({
        width: 7.2, height: 0.25, length: 0.5,
        x: -0.75, y: 3.1, z: -26.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "6 cm", {
        height: 0.25, size: 1.25,
        x: 4, y: 3.7, z: -26.925,
        rotateX: 0, rotateY: -Math.PI, rotateZ: 0
    }), createLine ({
        width: 6, height: 0.25, length: 0.5,
        x: 0.75, y: 3.7, z: -26.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "1.2 cm", {
        height: 0.25, size: 1,
        x: 4, y: 0.35, z: -26.925,
        rotateX: 0, rotateY: -Math.PI, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 1.2, height: 0.25, length: 0.5,
        x: 0.75, y: 0.1, z: -26.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030, false), createText(SCENE, "0.6", {
        height: 0.25, size: 1,
        x: -8.125, y: 2, z: -26.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 0.6, height: 0.25, length: 0.5,
        x: -8.125, y: 3, z: -26.5,
        rotateX: 0, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFF3030, false), createText(SCENE, "9.4 cm", {
        height: 0.25, size: 1,
        x: -8.125, y: 2, z: -21.5,
        rotateX: 0, rotateY: -Math.PI/2, rotateZ: 0
    }), createLine ({
        width: 9.4, height: 0.25, length: 0.5,
        x: -8.125, y: 3, z: -21.5,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: Math.PI/2
    }, 0xFFFFFF, false))

    // Doll
    createModel(SCENE, "doll.glb", 5.4);
    createModel(SCENE, "doll.glb", 22.2);

    // Shoes Holder
    OBJECT_GROUP.push(createWoodCube({
        width: 16, height: 5, length: 0.6,
        x: 0, y: -0.2, z: 19.3,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 5, length: 0.6,
        x: 0, y: 4.4, z: 19.3,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }), createWoodCube({
        width: 16, height: 5, length: 0.6,
        x: 0, y: 9, z: 19.3,
        rotateX: Math.PI/2, rotateY: 0, rotateZ: 0
    }))

    // Shoes Holder Sizes
    SIZE_GROUP.push(createText(SCENE, "5 cm", {
        height: 0.25, size: 2,
        x: 3.125, y: 9.425, z: 19.3,
        rotateX: -Math.PI/2, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 5, height: 0.25, length: 0.5,
        x: 7.125, y: 9.425, z: 19.3,
        rotateX: Math.PI/2, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }), createText(SCENE, "4 cm", {
        height: 0.25, size: 2,
        x: 4.5, y: 2.1, z: 21.925,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 4, height: 0.25, length: 0.5,
        x: 0, y: 2.1, z: 21.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030), createText(SCENE, "4 cm", {
        height: 0.25, size: 2,
        x: 4.5, y: 6.7, z: 21.925,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }, 0xFF3030), createLine ({
        width: 4, height: 0.25, length: 0.5,
        x: 0, y: 6.7, z: 21.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFF3030), createText(SCENE, "0.6 cm", {
        height: 0.25, size: 1,
        x: -3.25, y: -0.2, z: 21.925,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 0.6, height: 0.25, length: 0.5,
        x: 0, y: -0.2, z: 21.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "0.6 cm", {
        height: 0.25, size: 1,
        x: -3.25, y: 4.4, z: 21.925,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 0.6, height: 0.25, length: 0.5,
        x: 0, y: 4.4, z: 21.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFFFFFF, false), createText(SCENE, "0.6 cm", {
        height: 0.25, size: 1,
        x: -3.25, y: 9, z: 21.925,
        rotateX: 0, rotateY: 0, rotateZ: 0
    }), createLine ({
        width: 0.6, height: 0.25, length: 0.5,
        x: 0, y: 9, z: 21.925,
        rotateX: 0, rotateY: Math.PI/2, rotateZ: Math.PI/2
    }, 0xFFFFFF, false))

    createLight();
    OBJECT_GROUP.forEach(e => {
        try {
            SCENE.add(e);
        }
        catch {
            console.log(e);
        }
    });

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
