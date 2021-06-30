import * as THREE 			from 'three';
import { GLTFLoader } 		from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } 	from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } 		from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//scene
let camera, scene, renderer, obj, loaded = false;
const video = document.getElementById('video');
let videoTexture;
//for pad projection moving
let raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
let intersectPoint = new THREE.Vector3(0, 0, 0);
let composer;
let tvInfo = JSON.parse(sceneInfo); //Get JSON

const params = {
	exposure: 2.0,
	bloomStrength: 0.7,
	bloomThreshold: 0.0,
	bloomRadius: 0.1
};

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
		camera.position.set( 0.5, 2.5, 15.7 );
		camera.lookAt( 0, 2, 0 );

		const light = new THREE.PointLight( 0x404040 );
		light.position.set(0, 5, 5);
		light.intensity = 2;
		scene.add(light);

		const light2 = new THREE.PointLight( 0x12b4e0);
		light2.position.set(0, 10, -100);
		light2.intensity = 1;
		scene.add(light2);

		//scene
		let gltfLoader = new GLTFLoader();
		gltfLoader.setPath('./assets/models/');
		gltfLoader.load(
			'EVR_WebGL_v10.gltf',
			function (gltf) {
				obj = gltf.scene
				scene.add( obj );

				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
				gltf.parser;
				gltf.userData;
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

		const renderScene = new RenderPass( scene, camera );

		const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
		bloomPass.threshold = params.bloomThreshold;
		bloomPass.strength = params.bloomStrength;
		bloomPass.radius = params.bloomRadius;

		composer = new EffectComposer( renderer );
		composer.addPass( renderScene );
		composer.addPass( bloomPass );
		
		loop();
	}
}

function loop() {	
	if (obj !== undefined && !loaded) //&& && video.readyState == 4 !== undefined
	{
		console.log(obj)
		for (let j = 0; j < obj.children.length; j++) {
			if (obj.children[j].name.includes('girl'))
				obj.children[j].position.y -= 1;
		}		
		loaded = true;

		/*
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
		//obj.children[14].children[2].material.emissiveIntensity = 10.0;
		console.log(obj.children[14].children[2].material)
		*/

		console.log(obj)
		let tvLastIndex = 0;
		for (let i = 0; i < tvInfo.length; i++) {
			const element = tvInfo[i];
			//<video>
			let findTV = false;
			while (!findTV && tvLastIndex < obj.children.length) {
				if (obj.children[tvLastIndex].name.includes('OLD_TV')) {
					videoTexture = new THREE.VideoTexture( video );		
					videoTexture.flipY = false;
					let layer = 0;
					for (let i = 1; i < obj.children[tvLastIndex].children.length; i++) {
						if (obj.children[tvLastIndex].children[i].material.name.includes('screen'))
							layer = i;
					}
					obj.children[tvLastIndex].children[layer].material.emissiveIntensity = 10.0;
					obj.children[tvLastIndex].children[layer].material.emissiveMap = videoTexture;
					findTV = true;
					console.log(tvLastIndex)
				}
				tvLastIndex++;
			}
		}
	}
	
	composer.render();
	requestAnimationFrame(loop);
	//renderer.render(scene, camera);
}

export default App;
