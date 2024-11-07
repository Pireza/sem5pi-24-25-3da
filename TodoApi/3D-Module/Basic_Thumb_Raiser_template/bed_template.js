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
    constructor() {
        this.bed = new THREE.Group();

        const geometry1 = new THREE.BoxGeometry(15, 3, 35);
        const material1 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
        const base = new THREE.Mesh(geometry1, material1);
        base.position.set(-7, 11, -5);
        this.bed.scale.set(.03, .03, .03);
        this.bed.add(base);

        const geometry2 = new THREE.BoxGeometry(15, 2, 35);
        const material2 = new THREE.MeshStandardMaterial({ color: 'black' });
        const mat = new THREE.Mesh(geometry2, material2);
        mat.position.set(-7, 14, -5);
        this.bed.add(mat);

        const geometry3 = new THREE.BoxGeometry(4, 11, 4);
        const material3 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
        const stand = new THREE.Mesh(geometry3, material3);
        stand.position.set(-7, 6, -5);
        this.bed.add(stand);

        const geometry4 = new THREE.BoxGeometry(13, 3, 13);
        const material4 = new THREE.MeshStandardMaterial({ color: '#BEBEBE' });
        const standBase = new THREE.Mesh(geometry4, material4);
        standBase.position.set(-7, 2, -5);
        this.bed.add(standBase);

        // Create a bounding box for the bed
        this.bedBox = new THREE.Box3().setFromObject(this.bed);
    }
}