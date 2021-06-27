import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//scene
let camera, scene, renderer, obj, loaded = false;
const video = document.getElementById('video');
//for pad projection moving
let raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
let intersectPoint = new THREE.Vector3(0, 0, 0);

class App {
	init() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.clearColor(0x000000);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.toneMapping = THREE.ReinhardToneMapping;
		document.body.appendChild( renderer.domElement );

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 200 );
		camera.position.set( 0, 10, 18 );
		camera.lookAt( 0, 0, 0 );

		scene.add( new THREE.AmbientLight( 0xffffff ) );

		//scene
		let gltfLoader = new GLTFLoader();
		gltfLoader.setPath('./assets/models/');
		gltfLoader.load(
			'EVR_WebGL_v4_.gltf',
			function (gltf) {
				obj = gltf.scene
				scene.add( obj );

				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened' );
			}
		)
		
		renderer.render(scene, camera);

		loop();
	}
}

function loop() {	
	if (obj !== undefined && !loaded) //&& video.load() !== undefined
	{
		loaded = true;
		//console.log(obj.children[15].children[2]);
		obj.children[15].children[2].doubleSided = false;
		//Load texture
		let loader = new THREE.TextureLoader();
		let text1 = loader.load('./assets/img/panda.png', function (texture) {
			texture.minFilter = THREE.LinearFilter;
			texture.flipY = false;
		});
		loader = new THREE.TextureLoader();
		let text2 = loader.load('./assets/img/Tulips.jpg', function (texture) {
			texture.minFilter = THREE.LinearFilter;
			texture.flipY = false;
		});
		obj.children[15].children[2].material.emissiveMap = text1;
		obj.children[14].children[2].material.emissiveMap = text2;
		
		console.log(video.readyState)
		const texture = new THREE.VideoTexture( video );
		texture.flipY = false;
		//console.log(texture);
		obj.children[13].children[2].material.emissiveMap = texture;
	}
	
	requestAnimationFrame(loop);
	renderer.render(scene, camera);
}

export default App;
