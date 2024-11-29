import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Person {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a loader to load the GLTF model
        this.loader = new GLTFLoader();

        // Create an empty group to hold the bed model
        this.person = new THREE.Group();

        // Load the GLTF model asynchronously
        this.loadModel();
    }

    loadModel() {
        // Replace 'path_to_your_model.glb' with the actual path to your GLTF model
        const modelPath = this.modelUrl;

        this.loader.load(
            modelPath, // URL to the GLTF model
            (gltf) => {
                // Once the model is loaded, add it to the `bed` group
                this.person.add(gltf.scene);
                this.person.scale.set(.5, .5, 1);
                this.person.rotation.x = -Math.PI/2;

                // Create a bounding box for the bed model
                this.personBox = new THREE.Box3().setFromObject(this.person);
            },
            (xhr) => {
                // Log the progress of the model loading (optional)
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                // Handle loading errors
                console.error("Error loading model", error);
            }
        );
    }

}