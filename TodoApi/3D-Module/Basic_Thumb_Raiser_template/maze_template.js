import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";
import RoomTemplate from "./room_template.js";

export default class Maze {
    constructor(parameters) {
        this.roomsStatus = {};  // Declare a variable to store the room status JSON data
        this.loadRoomStatus();   // Call the method to load room status

        // Load maze data after room status is loaded
        this.onLoad = function (description) {
            this.size = description.size;
            this.rooms = description.rooms;

            // Create a group of objects
            this.object = new THREE.Group();
            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a bed
            this.bed = new BedTemplate({
                modelUrl: 'models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb'
            });
            // Create a person
            this.person = new Person({
                modelUrl: 'models/gltf/human/3d_scan_man_1.glb'
            });

            const roomBuilder = new RoomTemplate('textures/wall.jpg');

            let room, isOccupied;
            for (let i = 0; i < this.rooms.length; i++) {
                room = this.rooms[i];
                isOccupied = false;
                // Check if the room is occupied based on the status
                if (this.roomsStatus.rooms.includes(room.name)) {
                    isOccupied = true;
                }

                // Ensure the room is within bounds before placing it
                if (this.isRoomWithinBounds(room)) {
                    roomBuilder.generateRoom(
                        room.width,
                        room.length,
                        isOccupied,
                        room.bedDirection,
                        room.door
                    );
                    roomBuilder.setRoomPositions(room.x, room.y);
                    this.object.add(roomBuilder.getRoom());
                } else {
                    console.log(`Room ${room.name} is out of bounds and won't be placed.`);
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        };

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        };

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        };

        // Assign parameters to instance variables
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // Enable the cache
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();
        loader.setResponseType("json");

        // Load maze description resource file
        loader.load(
            this.url,
            description => this.onLoad(description),
            xhr => this.onProgress(this.url, xhr),
            error => this.onError(this.url, error)
        );
    }

    // Define loadRoomStatus method to load the RoomStatus JSON file
    loadRoomStatus() {
        fetch('mazes/RoomStatus.json')  // Path to the JSON file
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                this.roomsStatus = data;  // Store the JSON data in the variable
            })
            .catch(error => {
                console.error('Error loading the JSON file:', error);
            });
    }

    // Check if the room is within bounds
   isRoomWithinBounds(room) {
    // Room's left and right boundaries
    const left = room.x - room.width / 2;
    const right = room.x + room.width / 2;
    
    // Room's top and bottom boundaries
    const top = room.y + room.length / 2;
    const bottom = room.y - room.length / 2;

    // Check if the room is within the maze's boundaries
    if (left < -this.size.width / 2 || right > this.size.width / 2 || bottom < -this.size.height / 2 || top > this.size.height / 2) {
        return false; // Room is out of bounds
    }
    return true; // Room is within bounds
}

}
