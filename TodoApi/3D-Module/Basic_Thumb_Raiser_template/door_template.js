import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class doorTemplate {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a loader to load the GLTF model
        this.loader = new GLTFLoader();

        this.door = new THREE.Group();

        // Load the GLTF model asynchronously
        this.loadModel();
    }

    loadModel() {
        // Replace 'path_to_your_model.glb' with the actual path to your GLTF model
        const modelPath = this.modelUrl;

        this.loader.load(
            modelPath, // URL to the GLTF model
            (gltf) => {
                this.door.add(gltf.scene);

                // Scale and position adjustments if necessary (optional)
                this.door.scale.set(0.01, 0.011, 0.005);

                this.doorBox = new THREE.Box3().setFromObject(this.door);
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