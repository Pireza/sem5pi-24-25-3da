import * as THREE from "three";
import Ground from "./ground_template.js";
import Wall from "./wall_template.js";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size

            this.walls = [];

            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });
            // Create a bed
            this.bed = new BedTemplate({textureUrl: description.bedTextureUrl});
            // Create a person
             this.person = new Person({
                textureUrls: {
                    body: './textures/shirt.jpg',
                    arms: './textures/arm.jpg',
                    legs: './textures/pants.jpg',
                    head: './textures/head.jpg'
                }
            });
            
                        // Build the maze
            let wallObject;
            for (let i = 0; i <= description.size.width; i++) {
                for (let j = 0; j <= description.size.height; j++) {
                    const cell = description.map[j][i];

                    if (cell === 2 || cell === 3 || cell === 5) {
                        // Wall on top or with a door on top
                        wallObject = (cell === 5) ? this.wall.createWallWithDoor("top") : this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2 + 0.5, 0.5, j - description.size.height / 2);
                        this.walls.push(wallObject);
                        this.object.add(wallObject);
                        // Ensure to create the bounding box after adding the wall to the object
                        wallObject.wallBox = new THREE.Box3().setFromObject(wallObject);
                    }

                    if (cell === 1 || cell === 3 || cell === 4) {
                        // Wall on the left or with a door on the left
                        wallObject = (cell === 4) ? this.wall.createWallWithDoor("left") : this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2, 0.5, j - description.size.height / 2 + 0.5);
                        wallObject.rotateY(Math.PI / 2);
                        this.walls.push(wallObject);
                        this.object.add(wallObject);
                        // Ensure to create the bounding box after adding the wall to the object
                        wallObject.wallBox = new THREE.Box3().setFromObject(wallObject);
                    }
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;

            // Place the beds
            let newBed, newPerson;
            for (let i = 0; i < description.rooms.length; i++) {

                // Checks if the bed's coordinates are within the bounds of the floor
                if (Math.abs(description.rooms[i].bedX) >= description.size.width / 2
                    || Math.abs(description.rooms[i].bedY) >= description.size.height / 2)
                    continue;

                // Create the bed and set its position and rotation
                newBed = this.bed.bed.clone();
                newBed.position.set(description.rooms[i].bedX, 0, description.rooms[i].bedY);
                newBed.rotation.y = description.rooms[i].bedDirection * Math.PI / 180;

                // Create a bounding box for the new bed
                const bedBox = new THREE.Box3().setFromObject(newBed);

                // Check for overlaps with any walls using the wallBox property
                const overlaps = this.walls.some(wall => {
                    // Check if the wall has a defined wallBox
                    if (!wall.wallBox) {
                        console.warn('Wall box is undefined for a wall object:', wall);
                        return false;
                    }
                    return bedBox.intersectsBox(wall.wallBox);
                });

                // If there is an overlap, skip adding the bed
                if (overlaps) continue;

                // If no overlap, add the bed and person if occupied
                if (description.rooms[i].isOccupied) {
                    newPerson = this.person.person.clone();
                    newPerson.position.set(description.rooms[i].bedX, 0.3, description.rooms[i].bedY);
                    newPerson.rotation.y = description.rooms[i].bedDirection * Math.PI / 180;
                    this.object.add(newPerson);
                }
                this.object.add(newBed);
            }


        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

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
            //Resource URL
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
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    /* To-do #23 - Measure the player’s distance to the walls
        - player position: position
    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = ...;
        indices[1]++;
        if (... || ...) {
            return ...;
        }
        return ...;
    }

    distanceToNorthWall(position) {
        const indices = ...;
        if (... || ...) {
            return ...;
        }
        return ...;
    }

    distanceToSouthWall(position) {
        const indices = ...;
        ...++;
        if (... || ...3) {
            return ...z;
        }
        return ...;
    } */

    foundExit(position) {
        return false;
        /* To-do #42 - Check if the player found the exit
            - assume that the exit is found if the distance between the player position and the exit location is less than (0.5 * maze scale) in both the X- and Z-dimensions
            - player position: position
            - exit location: this.exitLocation
            - maze scale: this.scale
            - remove the previous instruction and replace it with the following one (after completing it)
        return ... < ... && ... */
    };
}