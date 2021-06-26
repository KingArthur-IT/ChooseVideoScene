import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//scene
let camera, scene, renderer;

//for pad projection moving
let raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
let intersectPoint = new THREE.Vector3(0, 0, 0);

class App {
	init() {
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.toneMapping = THREE.ReinhardToneMapping;
		document.body.appendChild( renderer.domElement );

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200 );
		camera.position.set( 0, 0, 20 );
		camera.lookAt( 0, 0, 0 );

		const controls = new OrbitControls( camera, renderer.domElement );
		controls.maxPolarAngle = Math.PI * 0.5;
		controls.minDistance = 1;
		controls.maxDistance = 100;
		controls.addEventListener( 'change', loop );

		scene.add( new THREE.AmbientLight( 0x404040 ) );

		/*
		//Load background texture
		let loader = new THREE.TextureLoader();
		loader.load(params.bgSrc, function (texture) {
			texture.minFilter = THREE.LinearFilter;
			scene.background = texture;
		});

		//light bulb
		let fbxLoader = new FBXLoader();
		fbxLoader.setPath(objectsParams.modelPath);
		fbxLoader.load(
			objectsParams.lightBulb.lightBulbObj,
			(object) => {
				object.scale.copy(objectsParams.lightBulb.scale);
				object.position.copy(objectsParams.lightBulb.position);
				object.rotation.setFromVector3(objectsParams.lightBulb.rotation);
				scene.add(object);
			}
		)
		*/
		renderer.render(scene, camera);

		loop();
	}
}

function loop() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

export default App;
