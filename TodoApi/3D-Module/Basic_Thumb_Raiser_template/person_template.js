import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
        const headMaterial = this.textureUrls?.head ? loadTexture(this.textureUrls.head) : new THREE.MeshStandardMaterial({ color: '#ffdbac' });

        // Create the geometry and meshes for the person
        const geometry1 = new THREE.BoxGeometry(7, 4, 14);
        const body = new THREE.Mesh(geometry1, bodyMaterial);
        body.position.set(-7, 6, -5);
        this.person.scale.set(.03, .03, .03);
        this.person.add(body);

        const geometry2 = new THREE.BoxGeometry(2.5, 2.5, 15);
        const leg = new THREE.Mesh(geometry2, legsMaterial);
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
        const head = new THREE.Mesh(geometry, headMaterial);
        head.position.set(-7, 6, -14);
        head.rotation.x= -(Math.PI/2);
        head.rotation.y = -(Math.PI / 2);
        this.person.add(head);
        /*
        // Add a point light to illuminate the person
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 10, 0); // Position it above the person
        this.person.add(light);

        // Add ambient light to ensure there is some general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
        this.person.add(ambientLight);
        */
    }
}
