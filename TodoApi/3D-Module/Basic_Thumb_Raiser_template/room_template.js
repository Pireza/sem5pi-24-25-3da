import * as THREE from "three";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";

export default class RoomTemplate {
    constructor(textureUrl) {
        this.wallThickness = .1;  // The thickness of the walls
        this.wallHeight = 5;        // The height of the walls


        this.directionMap = new Map();

        this.directionMap.set('north', 0.0);
        this.directionMap.set('south', Math.PI);
        this.directionMap.set('west', Math.PI / 2);
        this.directionMap.set('east', 3 * Math.PI / 2);



        if (textureUrl) {
            const textureLoader = new THREE.TextureLoader();
            this.material = new THREE.MeshBasicMaterial({
                map: textureLoader.load(textureUrl),
                side: THREE.DoubleSide,  // Ensure the texture is visible from both sides of the walls
            });
        } else {
            // If no texture is provided, use a basic color material
            this.material = new THREE.MeshBasicMaterial({ color: 0x888888 });
        }


        this.roomMesh = new THREE.Group();  // A group to hold all the walls
    }

    generateRoom(width, depth, occupied, direction) {

        this.roomMesh = new THREE.Group();
        // Create 4 walls: front, back, left, right

        // Front wall
        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            this.material
        );
        frontWall.position.set(0, this.wallHeight / 2, -depth / 2);
        this.roomMesh.add(frontWall);

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            this.material
        );
        backWall.position.set(0, this.wallHeight / 2, depth / 2);
        this.roomMesh.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            this.material
        );
        leftWall.position.set(-width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            this.material
        );
        rightWall.position.set(width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(rightWall);

        this.bed = new BedTemplate({
            modelUrl: 'models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb'
        });

        this.roomMesh.add(this.bed.bed);



        if (this.directionMap.has(direction))
            this.orientation = this.directionMap.get(direction);


        this.bed.bed.rotation.y = this.orientation;


        if (occupied) {
            this.person = new Person({
                modelUrl: 'models/gltf/human/3d_scan_man_1.glb'
            });

            this.person.person.position.y = 1.5;
            this.person.person.rotation.z = this.orientation;
            this.roomMesh.add(this.person.person);
        }
    }

    setRoomPositions(x, y) {
        this.roomMesh.position.set(x, 0, y);
    }
    getRoom() {
        return this.roomMesh;
    }
}
