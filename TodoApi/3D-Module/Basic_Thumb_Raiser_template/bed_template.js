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

        const loadTexture = (url) => {
            const texture = new THREE.TextureLoader().load(url);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            return new THREE.MeshStandardMaterial({ map: texture });
        };
        const baseMaterial = this.textureUrls?.base ? loadTexture(this.textureUrls.base) : new THREE.MeshStandardMaterial({ color: 'red' });
        const matMaterial = this.textureUrls?.mate ? loadTexture(this.textureUrls.mate) : new THREE.MeshStandardMaterial({ color: 'blue' });
        const standMaterial = this.textureUrls?.stand ? loadTexture(this.textureUrls.stand) : new THREE.MeshStandardMaterial({ color: 'green' });
        const standBaseMaterial = this.textureUrls?.standBase ? loadTexture(this.textureUrls.standBase) : new THREE.MeshStandardMaterial({ color: '#ffdbac' });


        this.bed = new THREE.Group();

        const base = new THREE.Mesh(new THREE.BoxGeometry(15, 3, 35), baseMaterial);
        base.position.set(-7, 11, -5);
        this.bed.scale.set(.03, .03, .03);
        this.bed.add(base);

        const mat = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 35), matMaterial);
        mat.position.set(-7, 14, -5);
        this.bed.add(mat);

        const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 11, 4), standMaterial);
        stand.position.set(-7, 6, -5);
        this.bed.add(stand);

        const standBase = new THREE.Mesh(new THREE.BoxGeometry(13, 3, 13), standBaseMaterial);
        standBase.position.set(-7, 2, -5);
        this.bed.add(standBase);

        // Create a bounding box for the bed
        this.bedBox = new THREE.Box3().setFromObject(this.bed);
    }
}
