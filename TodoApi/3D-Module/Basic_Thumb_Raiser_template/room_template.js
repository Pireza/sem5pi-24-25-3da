import * as THREE from "three";
import BedTemplate from "./bed_template.js"; 
import Wall from "./wall_template.js"; 
import Ground from "./ground_template.js"; 
import Person from "./person_template.js";

export default class RoomTemplate {
    constructor(parameters) {
        this.lenght = parameters.lenght;
        this.width = parameters.width;
        this.bedX = parameters.bedX;
        this.bedY = parameters.bedY;
        this.isActive= parameters.isActive;
        this.scale = parameters.scale || new THREE.Vector3(1, 1, 1);

        // Create room object group
        this.object = new THREE.Group();

        // Add ground to room
        this.ground = new Ground({ textureUrl: parameters.groundTextureUrl, size: { width: this.width, height: this.lenght } });
        this.object.add(this.ground.object);

        // Create walls for the room
        this.walls = [];
        this.createWalls();

        const bedXPos = this.width / 2;  // Center horizontally
        const bedYPos = this.lenght / 2; // Center vertically

        // Create and load bed
        this.bed = new BedTemplate({
            modelUrl: parameters.bedModelUrl,
            position: new THREE.Vector3(bedXPos, 0, bedYPos)
        });
        this.bed.loadModel().then(() => {
            // Apply scaling once the model is loaded
            this.bed.bed.scale.set(this.bedX, 0.01, this.bedY);  
            // Add bed to room
            this.object.add(this.bed.bed);
            if(this.isActive===1){
                const bedHeight = this.bed.bed.scale.y * 0.01;  // Assuming the bed's height scale is proportional to this value
            this.person.bed.position.set(this.bed.bed.position.x , bedHeight + 1.4, this.bed.bed.position.z+1); // Adjust Y for height
         
            this.object.add(this.person.bed);
            }
            
        }).catch(error => {
            console.error("Error loading the bed model:", error);
        });
        if(this.isActive===1){
            this.person = new Person({
            modelUrl: './models/gltf/human/indian_man_in_kurta.glb', 
        });
        this.person.loadModel().then(() => {
            console.log('Person model loaded');
            this.person.bed.rotation.set(-Math.PI/2, 0, 0);
            this.person.bed.scale.set(0.6, 0.6, 0.6); 
        }).catch(error => {
            console.error("Error loading the person model:", error);
        });

        }
        
        // Scale the room object, but not affecting Y-axis scaling
        this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
    }

    createWalls() {
        const wallParams = { textureUrl: "./textures/wall.jpg" };
        const wallHeight = 5; // Fixed height for all walls

        // North wall
        let northWall = new Wall(wallParams);
        northWall.object.position.set(0, wallHeight / 2, this.lenght / 2);
        northWall.object.scale.set(this.width, wallHeight, 1);
        this.walls.push(northWall);
        this.object.add(northWall.object);

        // South wall
        let southWall = new Wall(wallParams);
        southWall.object.position.set(0, wallHeight / 2, -this.lenght / 2);
        southWall.object.scale.set(this.width, wallHeight, 1);
        this.walls.push(southWall);
        this.object.add(southWall.object);

        // West wall
        let westWall = new Wall(wallParams);
        westWall.object.position.set(this.width / 2, wallHeight / 2, 0);
        westWall.object.rotation.y = Math.PI / 2; 
        westWall.object.scale.set(this.lenght, wallHeight, 1);
        this.walls.push(westWall);
        this.object.add(westWall.object);

        // East wall
        let eastWall = new Wall(wallParams);
        eastWall.object.position.set(-this.width / 2, wallHeight / 2, 0);
        eastWall.object.rotation.y = Math.PI / 2; 
        eastWall.object.scale.set(this.lenght, wallHeight, 1);
        this.walls.push(eastWall);
        this.object.add(eastWall.object);
    }
}
