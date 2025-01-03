import * as THREE from "three";
import { bedData } from "./default_data.js";

export class PickHelper {
    
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera, controls) {
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }
    
        this.raycaster.setFromCamera(normalizedPosition, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    
        if (intersectedObjects.length) {
            this.pickedObject = intersectedObjects[0].object;
            const targetPosition = this.getPickedObjectPosition(this.pickedObject);
    
            if (targetPosition ) {
              
                this.animateCamera(camera, controls, targetPosition);
                
                return targetPosition;
            }
        }
        return null; // No object clicked
    }
    

    getPickedObjectPosition(object) {
        // Check if the object is valid
        if (!object || !object.parent) return null;

        // Calculate the bounding box of the object
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Offset the camera position to look down from above
        const offsetY = size.y + 10; // Adjust height above the object
        return new THREE.Vector3(center.x, center.y + offsetY, center.z);
    }

    animateCamera(camera, controls, targetPosition) {
        let currentObject = this.pickedObject;
    
        // Find the "room_" object and start the animation
        while (currentObject) {
            console.log(currentObject);
            if (currentObject.name.startsWith("room_")) {
                // Set up animation
                const duration = 2; // Duration in seconds
                const startPosition = camera.position.clone();
                const startTime = performance.now();
    
                const animate = () => {
                    const elapsedTime = (performance.now() - startTime) / 1000; // Convert to seconds
                    const t = Math.min(elapsedTime / duration, 1); // Normalize to [0, 1]
    
                    // Interpolate the camera position to smoothly move to the target
                    camera.position.lerpVectors(startPosition, targetPosition, t);
    
                    // Update controls to maintain smooth movement
                    if (controls) {
                        controls.update();
                    }
    
                    if (t < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure the camera looks straight down at the target after animation
                        camera.lookAt(new THREE.Vector3(targetPosition.x, targetPosition.y - 10, targetPosition.z));
                        if (controls) {
                            controls.target.set(targetPosition.x, targetPosition.y - 10, targetPosition.z);
                            controls.update();
                        }
    
                        // Persist the camera's final position as the new current position
                        camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
                    }
                };
    
                requestAnimationFrame(animate);
                break; // Exit the loop after processing the first "room_" object
            }
    
            // Move to the parent object to check further in the hierarchy
            currentObject = currentObject.parent;
        }
    }
    
    

    getRoomInfo() {
        if (!this.pickedObject) return null;

        // Traverse up the hierarchy to find the room group
        let currentObject = this.pickedObject;
        while (currentObject) {
            if (currentObject.name.startsWith("room_")) {
                console.log(currentObject.userData.info);
                return currentObject.userData.info;
            }
            currentObject = currentObject.parent;
            console.log(currentObject);
        }

        return null;
    }
}
