import * as THREE from "three";
import DoorTemplate from "./door_template.js";
/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class WallDoor {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;



        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        this.object = new THREE.Group();


        this.door = new DoorTemplate({
            modelUrl: 'models/gltf/door/door.glb'  // Path to your door model
        });


        this.door.door.position.set(0.0, -0.35, -0.025);
        this.door.door.rotation.y = Math.PI / 2;
        this.object.add(this.door.door);

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(.25, 3.0);

        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.375, 0.0, 0.025);

        this.object.add(face);


        face = new THREE.Mesh().copy(face, false);
        face.position.set(-0.375, 0.0, 0.025);
        this.object.add(face);

        // Create the rear face (a rectangle)
        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(0.375, 0.0, -0.025);
        this.object.add(face);


        face = new THREE.Mesh().copy(face, false);
        face.position.set(-0.375, 0.0, -0.025);
        this.object.add(face);


        let geometryDoor = new THREE.PlaneGeometry(.50, .5);
        let faceDoor = new THREE.Mesh(geometryDoor, material);
        faceDoor.position.set(0.0, 1.25, 0.025);
        this.object.add(faceDoor);


        faceDoor = new THREE.Mesh().copy(faceDoor, false);
        faceDoor.rotation.y = Math.PI;
        faceDoor.position.set(0.0, 1.25, -0.025);
        this.object.add(faceDoor);


        // Create the two left faces (a four-triangle mesh)
        let points = new Float32Array([
            -0.5, -1.5, 0.025,
            -0.5, 1.5, 0.025,
            -0.5, 1.5, 0.0,
            -0.5, -1.5, 0.0,

            -0.5, 1.5, 0.0,
            -0.5, 1.5, -0.025,
            -0.5, -1.5, -0.025,
            -0.5, -1.5, 0.0
        ]);
        let normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        let indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        face = new THREE.Mesh(geometry, material);

        this.object.add(face);

        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        this.object.add(face);


        points = new Float32Array([
            -0.5, 1.5, -0.025,
            .5, 1.5, -.025,
            //.5, 1.5, .0,
            .5, 1.5, .025,
            -.5, 1.5, .025,
            //-.5, 1.5, .0
        ]);
        normals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0
        ]);
        indices = [
            2, 1, 0,
            2, 0, 3
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material);



        this.object.add(face);
        this.wallBox = new THREE.Box3().setFromObject(this.object);
    }

}