import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class BedTemplate {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a loader to load the GLTF model
        this.loader = new GLTFLoader();

        // Create an empty group to hold the bed model
        this.bed = new THREE.Group();

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
                this.bed.add(gltf.scene);

                // Scale and position adjustments if necessary (optional)
                this.bed.scale.set(0.005, 0.005, 0.005);
                this.bed.position.set(0, 0, 0); // Adjust the position if necessary

                // Create a bounding box for the bed model
                this.bedBox = new THREE.Box3().setFromObject(this.bed);
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
