import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";
import WallDoor from "./wall_with_door.js";
import DoorTemplate from "./door_template.js"

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


            this.wall = new Wall({ textureUrl: description.wallTextureUrl });
            this.wallDoor = new WallDoor({ textureUrl: description.wallTextureUrl });


            let wallObject, side;




            // Build the floor enclosure

            for (let i = 0; i < this.size.width; i++) {
                wallObject = this.wall.object.clone();
                wallObject.position.set(- this.size.width / 2.0 + i + .5, 1.5, - this.size.height / 2.0);
                this.object.add(wallObject);

                wallObject = this.wall.object.clone();
                wallObject.position.set(- this.size.width / 2.0 + i + .5, 1.5, + this.size.height / 2.0);
                this.object.add(wallObject);
            }

            for (let i = 0; i < this.size.height; i++) {
                wallObject = this.wall.object.clone();
                wallObject.position.set(- this.size.width / 2.0, 1.5, - this.size.height / 2.0 + i + .5);
                wallObject.rotateY(Math.PI / 2.0);
                this.object.add(wallObject);

                wallObject = this.wall.object.clone();
                wallObject.position.set(this.size.width / 2.0, 1.5, - this.size.height / 2.0 + i + .5);
                wallObject.rotateY(Math.PI / 2.0);
                this.object.add(wallObject);
            }


            // Build the rooms
            let currRoom, bedObject, personObject, doorObject;

            for (let i = 0; i < this.rooms.length; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                currRoom = this.rooms[i];
                let occupied= false;
                doorObject = new DoorTemplate({ modelUrl: 'models/gltf/door/door.glb' });
                const roomGroup = new THREE.Group();
                
                switch (currRoom.door) {
                    case 'right':
                        side = 0;
                        break;
                    case 'left':
                        side = 1;
                        break;
                    case 'front':
                        side = 2;
                        break;
                    default:
                        side = 3;
                        break;
                }


                for (let j = 0; j < currRoom.width; j++) {

                    if (side == 0 && j == (currRoom.width / 2 | 0)) {
                        wallObject = this.wallDoor.object.clone();
                        doorObject.door.position.set(currRoom.x - currRoom.width / 2.0 + j + .5, 1.2, currRoom.y - currRoom.length / 2.0);
                        doorObject.door.rotation.y = Math.PI / 2;
                        roomGroup.add(doorObject.door);
                    } else {
                        wallObject = this.wall.object.clone();
                    }
                    wallObject.position.set(currRoom.x - currRoom.width / 2.0 + j + .5, 1.5, currRoom.y - currRoom.length / 2.0);
                    roomGroup.add(wallObject);

                    if (side == 1 && j == (currRoom.width / 2 | 0)) {
                        wallObject = this.wallDoor.object.clone();
                        doorObject.door.position.set(currRoom.x - currRoom.width / 2.0 + j + .5, 1.2, currRoom.y + currRoom.length / 2.0);
                        doorObject.door.rotation.y = Math.PI / 2;
                        roomGroup.add(doorObject.door);
                    } else {
                        wallObject = this.wall.object.clone();
                    }

                    wallObject.position.set(currRoom.x - currRoom.width / 2.0 + j + .5, 1.5, currRoom.y + currRoom.length / 2.0);
                    roomGroup.add(wallObject);

                }


                for (let k = 0; k < currRoom.length; k++) {

                    if (side == 2 && k == (currRoom.length / 2 | 0)) {
                        wallObject = this.wallDoor.object.clone();
                        doorObject.door.position.set(currRoom.x - currRoom.width / 2.0, 1.2, currRoom.y - currRoom.length / 2.0 + k + .5);
                        roomGroup.add(doorObject.door);
                    } else {
                        wallObject = this.wall.object.clone();
                    }

                    wallObject.position.set(currRoom.x - currRoom.width / 2.0, 1.5, currRoom.y - currRoom.length / 2.0 + k + .5);
                    wallObject.rotateY(Math.PI / 2.0);
                    roomGroup.add(wallObject);


                    if (side == 3 && k == (currRoom.length / 2 | 0)) {
                        wallObject = this.wallDoor.object.clone();
                        doorObject.door.position.set(currRoom.x + currRoom.width / 2.0, 1.2, currRoom.y - currRoom.length / 2.0 + k + .5);
                        roomGroup.add(doorObject.door);
                    } else {
                        wallObject = this.wall.object.clone();
                    }

                    wallObject.position.set(currRoom.x + currRoom.width / 2.0, 1.5, currRoom.y - currRoom.length / 2.0 + k + .5);
                    wallObject.rotateY(Math.PI / 2.0);

                    roomGroup.add(wallObject);

                }

                bedObject = new BedTemplate({ modelUrl: 'models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb' });
                bedObject.bed.position.set(currRoom.x, 0.0, currRoom.y);
                bedObject.bed.rotation.y = this.convertDegreesToRadians(currRoom.bedDirection);
                roomGroup.add(bedObject.bed);

                if (this.roomsStatus.rooms.includes(currRoom.name)) {
                    personObject = new Person({ modelUrl: 'models/gltf/human/3d_scan_man_1.glb' });
                    personObject.person.position.set(currRoom.x, .75, currRoom.y);
                    personObject.person.rotation.z = this.convertDegreesToRadians(currRoom.bedDirection);
                    roomGroup.add(personObject.person);
                    occupied=true;
                } 
             
                  roomGroup.userData.info = {
                    name: currRoom.name,
                    width: currRoom.width,
                    depth: currRoom.length,
                    occupied: occupied,
                    direction: currRoom.bedDirection,
                    doorPosition: currRoom.door,
                };   
                roomGroup.name = `room_${currRoom.name}`;
                roomGroup.width = currRoom.width;
                roomGroup.length= currRoom.length;
                roomGroup.bedDirection=currRoom.bedDirection;
                roomGroup.door= currRoom.door;
                        
                this.object.add(roomGroup);

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

    convertDegreesToRadians(deg) {
        return deg * Math.PI / 180;
    }

}
