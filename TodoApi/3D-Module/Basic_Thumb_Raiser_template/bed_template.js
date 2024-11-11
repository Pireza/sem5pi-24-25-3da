import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { fixedView: String, firstPersonView: String, thirdPersonView: String, topView: String, viewMode: String, userInterface: String, miniMap: String, help: String, statistics: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 */

export default class BedTemplate {
    constructor(parameters) { 
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Check if textureUrl is provided
        if (this.textureUrl) {
            console.log("texture working");

            const texture = new THREE.TextureLoader().load(this.textureUrl);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;

            // Apply texture to the materials
            this.material1 = new THREE.MeshStandardMaterial({ map: texture });
            this.material2 = new THREE.MeshStandardMaterial({  map: texture });
            this.material3 = new THREE.MeshStandardMaterial({  map: texture });
            this.material4 = new THREE.MeshStandardMaterial({  map: texture });
        } else {
            console.warn("No textureUrl provided. Texture will not be applied.");
            this.material1 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
            this.material2 = new THREE.MeshStandardMaterial({ color: 'black' });
            this.material3 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
            this.material4 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
        }

        this.bed = new THREE.Group();

        const base = new THREE.Mesh(new THREE.BoxGeometry(15, 3, 35), this.material1);
        base.position.set(-7, 11, -5);
        this.bed.scale.set(.03, .03, .03);
        this.bed.add(base);

        const mat = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 35), this.material2);
        mat.position.set(-7, 14, -5);
        this.bed.add(mat);

        const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 11, 4), this.material3);
        stand.position.set(-7, 6, -5);
        this.bed.add(stand);

        const standBase = new THREE.Mesh(new THREE.BoxGeometry(13, 3, 13), this.material4);
        standBase.position.set(-7, 2, -5);
        this.bed.add(standBase);

        // Create a bounding box for the bed
        this.bedBox = new THREE.Box3().setFromObject(this.bed);
    }
}
