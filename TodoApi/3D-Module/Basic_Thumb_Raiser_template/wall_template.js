import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class Wall {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;


        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        this.object = new THREE.Group();

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(0.95, 1.0);

        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 0.0, 0.025);

        this.object.add(face);

        // Create the rear face (a rectangle)
        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(0.0, 0.0, -0.025);
        this.object.add(face);

        // Create the two left faces (a four-triangle mesh)
        let points = new Float32Array([
            -0.475, -0.5, 0.025,
            -0.475, 0.5, 0.025,
            -0.5, 0.5, 0.0,
            -0.5, -0.5, 0.0,

            -0.5, 0.5, 0.0,
            -0.475, 0.5, -0.025,
            -0.475, -0.5, -0.025,
            -0.5, -0.5, 0.0
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
            -0.475, 0.5, -0.025,
            .475, .5, -.025,
            .5, .5, .0,
            .475, .5, .025,
            -.475, .5, .025,
            -.5, .5, .0
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
            0, 3, 1,
            2, 1, 0,
            4, 3, 0,
            5, 4, 0
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material);



        this.object.add(face);
        this.wallBox = new THREE.Box3().setFromObject(this.object);
    }

    createWallWithDoor(isNorthWall) {
        // Create a new wall object group
        const wallWithDoor = new THREE.Group();

        // Clone the basic wall structure
        const wallFace = this.object.clone();
        wallWithDoor.add(wallFace);

        // Door dimensions to match wall height and be slightly thicker
        const doorWidth = 0.2; // Width of the door
        const doorHeight = 0.95; // Height of the door, close to the wall’s height
        const doorThickness = 0.1; // Slightly thicker than wall for visibility

        // Create the door geometry and material
        const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
        const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x663300 });

        // Door mesh with both faces visible
        const door = new THREE.Mesh(doorGeometry, doorMaterial);

        // Position the door based on wall orientation
        if (isNorthWall) {
            // Place the door in the middle of the north-facing wall
            door.position.set(0, 0, 0); // Z-axis adjustment for north-facing wall
        } else {
            // Place the door in the middle of the west-facing wall
            door.position.set(0, 0, 0); // X-axis adjustment for west-facing wall
            door.rotation.y = Math.PI / 2; // Rotate 90 degrees for west-facing orientation
        }

        wallWithDoor.add(door); // Add the door to the wallWithDoor group
        return wallWithDoor;
    }



}