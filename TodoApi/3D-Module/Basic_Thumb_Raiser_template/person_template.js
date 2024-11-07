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


    constructor() {
        this.person = new THREE.Group();

        const geometry1 = new THREE.BoxGeometry(7, 4, 14);
        const material1 = new THREE.MeshStandardMaterial({ color: 'blue' });
        const body = new THREE.Mesh(geometry1, material1);
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
        const material3 = new THREE.MeshStandardMaterial({ color: 'blue' });
        const arm = new THREE.Mesh(geometry3, material3);
        arm.position.set(-11.5, 7, -6);
        this.person.add(arm);


        const otherArm = arm.clone();
        otherArm.position.set(-2.5, 7, -6);
        this.person.add(otherArm);


        const geometry = new THREE.SphereGeometry(2.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(geometry, material);
        head.position.set(-7, 6,-14);

        this.person.add(head);
    }



}