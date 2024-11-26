import * as THREE from "three";
import { bedData } from "./default_data.js";

export class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera) {
        // restore the color if there is a picked object
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(
                this.pickedObjectSavedColor
            );
            this.pickedObject = undefined;
        }
        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // get the list of objects the ray intersected
        this.intersectedObjects =
            this.raycaster.intersectObjects(scene.children);



        if (this.intersectedObjects.length) {
            // pick the first object. It's the closest one

            this.pickedObject = this.intersectedObjects[0].object;
        
            /*
                        if (this.pickedObject.name !== bedData.bedObjectName) {
                            this.pickedObject = undefined;
                            return;
                        }
            */
            // save its color
            this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            // set its emissive color to flashing red/yellow
            this.pickedObject.material.emissive.setHex(
                0xFF0000
            );
        }
    }

    getPickedObjectParentPosition(){
        return this.pickedObject.parent.position;
    }
   
}