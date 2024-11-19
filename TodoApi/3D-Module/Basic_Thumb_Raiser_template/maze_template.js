import * as THREE from "three";
import RoomTemplate from "./room_template.js"; // Assuming you have this already

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Create a group of objects
            this.object = new THREE.Group();

            let currentX = -20; // Starting X position
            let currentZ = -20; // Starting Z position
            const spacing = 0.01; // Small spacing between rooms

            this.rooms = [];
            for (let i = 0; i < description.rooms.length; i++) {
                const roomData = description.rooms[i];

                // Create the room
                const room = new RoomTemplate({
                    lenght: roomData.lenght,
                    width: roomData.width,
                    bedX: roomData.bedX,
                    bedY: roomData.bedY,
                    bedD: roomData.bedD,
                    isActive: roomData.isActive,
                    groundTextureUrl: description.groundTextureUrl,
                    bedModelUrl: './models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb'
                });

                // Set the room's position
                room.object.position.set(
                    currentX + roomData.width / 2, // Centered X position
                    -20, // Fixed Y position
                    currentZ - roomData.lenght / 2 // Centered Z position
                );

                // Add the room to the maze
                this.rooms.push(room);
                this.object.add(room.object);

                // Update the positions for the next room
                if ((i + 1) % 3 === 0) {
                    // Start a new row after every 3 rooms
                    currentX = -20; // Reset X to the starting position
                    currentZ += roomData.lenght + 8; // Move Z downward for the new row
                } else {
                    // Place the next room side by side
                    currentX += roomData.width + spacing;
                }
            }

            this.loaded = true;
        };

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        };
        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        };
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;
        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;
        // Create a resource file loader
        const loader = new THREE.FileLoader();
        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");
        // Load a maze description resource file
        loader.load(
            // Resource URL
            this.url,
            // onLoad callback
            description => this.onLoad(description),
            // onProgress callback
            xhr => this.onProgress(this.url, xhr),
            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3(
            (position[1] - this.size.width / 2.0 + 0.5) * this.scale.x,
            0.0,
            (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z
        );
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [
            Math.floor(position.z / this.scale.z + this.size.height / 2.0),
            Math.floor(position.x / this.scale.x + this.size.width / 2.0)
        ];
    }
}
