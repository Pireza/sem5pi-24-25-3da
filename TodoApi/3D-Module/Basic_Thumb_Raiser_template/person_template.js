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

export default class Person {
    constructor(parameters = {}) {
        // Loop through parameters and assign them to the instance
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group to hold the person's body parts
        this.person = new THREE.Group();

        // If textureUrl is provided, load the texture and apply it to material1
        const loadTexture = (url) => {
            const texture = new THREE.TextureLoader().load(url);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            return new THREE.MeshStandardMaterial({ map: texture });
        };
        const bodyMaterial = this.textureUrls?.body ? loadTexture(this.textureUrls.body) : new THREE.MeshStandardMaterial({ color: 'red' });
        const armsMaterial = this.textureUrls?.arms ? loadTexture(this.textureUrls.arms) : new THREE.MeshStandardMaterial({ color: 'blue' });
        const legsMaterial = this.textureUrls?.legs ? loadTexture(this.textureUrls.legs) : new THREE.MeshStandardMaterial({ color: 'green' });
        const headMaterial = this.textureUrls?.head ? loadTexture(this.textureUrls.head) : new THREE.MeshStandardMaterial({ color: 'ffdbac' });

        // Create the geometry and meshes for the person
        const geometry1 = new THREE.BoxGeometry(7, 4, 14);
        const body = new THREE.Mesh(geometry1, bodyMaterial);
        body.position.set(-7, 6, -5);
        this.person.scale.set(.03, .03, .03);
        this.person.add(body);

        const geometry2 = new THREE.BoxGeometry(2.5, 2.5, 15);
        const material2 = new THREE.MeshStandardMaterial({ color: 'gray' });
        const leg = new THREE.Mesh(geometry2, material2);
        leg.position.set(-5, 6, 6);
        this.person.add(leg);

        const otherLeg = leg.clone();
        otherLeg.position.set(-9, 6, 6);
        this.person.add(otherLeg);

        const geometry3 = new THREE.BoxGeometry(2, 2, 10);
        const arm = new THREE.Mesh(geometry3, armsMaterial);
        arm.position.set(-11.5, 7, -6);
        this.person.add(arm);

        const otherArm = arm.clone();
        otherArm.position.set(-2.5, 7, -6);
        this.person.add(otherArm);

        const geometry = new THREE.SphereGeometry(2.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(geometry, material);
        head.position.set(-7, 6, -14);
        this.person.add(head);
    }

   
}
