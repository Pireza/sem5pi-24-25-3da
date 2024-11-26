import * as THREE from "three";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";
import DoorTemplate from "./door_template.js";  // Import the doorTemplate class

export default class RoomTemplate {
    constructor(textureUrl) {
        this.wallThickness = 0.1;  // Thickness of the walls
        this.wallHeight = 5;      // Height of the walls

        this.id = 0;
        this.texture = textureUrl;
        this.directionMap = new Map();
        this.directionMap.set('north', 0.0);
        this.directionMap.set('south', Math.PI);
        this.directionMap.set('west', Math.PI / 2);
        this.directionMap.set('east', 3 * Math.PI / 2);

        this.rooms = [];

        this.roomMesh = new THREE.Group();  // A group to store all the walls
    }

    generateRoom(width, depth, occupied, direction = 'north', doorPosition = 'front', bedX = 0.0, bedY = 0.0) {


        let material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        // Material that reacts to light
        if (this.texture) {
            const textureLoader = new THREE.TextureLoader();
            material = new THREE.MeshStandardMaterial({
                map: textureLoader.load(this.texture),
                side: THREE.DoubleSide,  // Ensure the texture is visible from both sides
            });
        }

        this.roomMesh = new THREE.Group();
        this.rooms.push(this.roomMesh);
        this.roomMesh.name = "room" + this.id++;
        // Create 4 walls: front, back, left, right

        // Front wall
        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            material
        );
        frontWall.position.set(0, this.wallHeight / 2, -depth / 2);
        this.roomMesh.add(frontWall);

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            material
        );
        backWall.position.set(0, this.wallHeight / 2, depth / 2);
        this.roomMesh.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            material
        );
        leftWall.position.set(-width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            material
        );
        rightWall.position.set(width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(rightWall);

        // Add the door to the selected wall
        this.addDoor(doorPosition, width, depth);

        // Add the bed
        this.bed = new BedTemplate({
            modelUrl: 'models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb'
        });
        this.roomMesh.add(this.bed.bed);

        if (this.directionMap.has(direction))
            this.orientation = this.directionMap.get(direction);


        this.bed.bed.rotation.y = this.orientation;
        this.bed.bed.position.set(bedX, 0, bedY);

        if (occupied) {
            this.person = new Person({
                modelUrl: 'models/gltf/human/3d_scan_man_1.glb'
            });

            this.person.person.position.set(bedX, 1.5, bedY);
            this.person.person.rotation.z = this.orientation;
            this.roomMesh.add(this.person.person);
        }

        this.roomMesh.userData.info = {
            name: this.roomMesh.name,
            width: width,
            depth: depth,
            occupied: occupied,
            direction: direction,
            doorPosition: doorPosition,
        };
        // Add the spotlight
        this.addSpotlight(width, depth);
    }

    addDoor(position, width, depth) {
        // Create a new door instance based on the doorTemplate class
        const door = new DoorTemplate({
            modelUrl: 'models/gltf/door/door.glb'  // Path to your door model
        });

        // Wait for the door model to load
        door.door.position.set(0, this.wallHeight / 2, 0);  // Default position

        // Position and rotate the door on the selected wall
        if (position === 'front') {
            // Place the door on the front wall (Z = -depth/2) and align it
            door.door.position.set(0, this.wallHeight / 2, -depth / 2 + this.wallThickness / 2);
            door.door.rotation.y = Math.PI / 2;  // Door should face inside the room
        } else if (position === 'back') {
            // Place the door on the back wall (Z = depth/2) and align it
            door.door.position.set(0, this.wallHeight / 2, depth / 2 - this.wallThickness / 2);
            door.door.rotation.y = 3 * Math.PI / 2;  // Door should face inside the room (opposite direction)
        } else if (position === 'left') {
            // Place the door on the left wall (X = -width/2) and rotate it to align
            door.door.position.set(-width / 2 + this.wallThickness / 2, this.wallHeight / 2, 0);
            door.door.rotation.y = 0;  // Rotate the door to face the left wall, parallel to it
        } else if (position === 'right') {
            // Place the door on the right wall (X = width/2) and rotate it to align
            door.door.position.set(width / 2 - this.wallThickness / 2, this.wallHeight / 2, 0);
            door.door.rotation.y = Math.PI;  // Rotate the door to face the right wall, parallel to it
        }

        // Add the door to the room's mesh
        this.roomMesh.add(door.door);
    }

    addSpotlight(width, depth) {
        const spotlight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 3, 0.5, 2);
        spotlight.position.set(0, this.wallHeight + 5, 0);  // Position it above the room
        spotlight.target.position.set(0, this.wallHeight / 2, 0);  // Focus on the center of the room
        spotlight.castShadow = true;

        spotlight.distance = Math.max(width, depth) * 1.5;  // Cover the entire room
        spotlight.angle = Math.PI / 3;  // Adjust the spotlight angle
        spotlight.intensity = 21;  // Increase the intensity

        this.roomMesh.add(spotlight);
    }

    setRoomPositions(x, y) {
        this.roomMesh.position.set(x, 0, y);
    }

    getRoom() {
        return this.roomMesh;
    }
}
