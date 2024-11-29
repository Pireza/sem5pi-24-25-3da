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

        // Initialize the bedBox
        this.bedBox = new THREE.Box3();

        // Load the GLTF model asynchronously
        this.loadModel();

    }

    loadModel() {
        return new Promise((resolve, reject) => {
            const modelPath = this.modelUrl;

            this.loader.load(
                modelPath,  // Path to the GLTF model
                (gltf) => {
                    // Once the model is loaded, add it to the `bed` group
                    this.bed.add(gltf.scene);

                    // Scale and position adjustments if necessary
                    this.bed.scale.set(0.005, 0.005, 0.005);

                    // Recalculate the bounding box based on the loaded model
                    this.bedBox.setFromObject(this.bed);

                    // Resolve the promise once the model is loaded and bedBox is set
                    resolve();
                },
                (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
                },
                (error) => {
                    console.error("Error loading model", error);
                    reject(error);
                }
            );
        });
    }
}
