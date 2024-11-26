import * as THREE from "three";
import Orientation from "./orientation.js";

export const generalData = {
    setDevicePixelRatio: false
}

export const bedData = {
    bedObjectName: "Surgery_Table_LO_M_surgery_table_0"
}

export const mazeData = {
    url: "./mazes/Loquitas.json",
    credits: "Maze designed by Cecília Fernandes and Nikita.",
    scale: new THREE.Vector3(1.0, 1.0, 1.0)
}

export const playerData = {
    url: "./models/gltf/RobotExpressive/RobotExpressive.glb",
    credits: "Model and related code snippets created by <a href='https://www.patreon.com/quaternius' target='_blank' rel='noopener'>Tomás Laulhé</a>. CC0 1.0. Modified by <a href='https://donmccurdy.com/' target='_blank' rel='noopener'>Don McCurdy</a>.",
    eyeHeight: 0.8, // fraction of character height
    scale: new THREE.Vector3(0.1, 0.1, 0.1),
    walkingSpeed: 0.75,
    initialDirection: 0.0, // Expressed in degrees
    turningSpeed: 75.0, // Expressed in degrees / second
    runningFactor: 2.0, // Affects walking speed and turning speed
    keyCodes: { fixedView: "Digit1", firstPersonView: "Digit2", thirdPersonView: "Digit3", topView: "Digit4", viewMode: "KeyV", userInterface: "KeyU", miniMap: "KeyM", help: "KeyH", statistics: "KeyS", run: "KeyR", left: "ArrowLeft", right: "ArrowRight", backward: "ArrowDown", forward: "ArrowUp", jump: "KeyJ", yes: "KeyY", no: "KeyN", wave: "KeyW", punch: "KeyP", thumbsUp: "KeyT" }
}

export const ambientLightData = {
    visible: true,
    color: new THREE.Color(0xffffff),
    intensity: .3,
    intensityMin: 0.0,
    intensityMax: 1.0,
    intensityStep: 0.01
}

export const directionalLightData = {
    visible: true,
    color: new THREE.Color(0xffffff),
    intensity: 0.8, // Slightly dimmer than before
    intensityMin: 0.1, // Minimum intensity
    intensityMax: 1.0, // Maximum intensity stays the same
    intensityStep: 0.05, // Larger step for intensity changes
    distance: 5.0, // Increased distance
    orientation: new Orientation(30.0, 120.0), // New orientation angles
    orientationMin: new Orientation(-90.0, 30.0), // Adjusted min orientation
    orientationMax: new Orientation(90.0, 150.0), // Adjusted max orientation
    orientationStep: new Orientation(2.0, 2.0), // Larger step for orientation
    castShadow: true,
    shadow: {
        mapSize: new THREE.Vector2(1024, 1024), // Increased shadow map size for better quality
        camera: { 
            left: -10.0, 
            right: 10.0, 
            top: 10.0, 
            bottom: -10.0, 
            near: 1.0, // Nearer clipping plane
            far: 1000.0 // Farther clipping plane for larger scene
        }
    }
}


export const fogData = {
    enabled: false,
    color: 0xe0e0e0,
    near: 0.1,
    far: 14.0
}

export const cameraData = {
    view: "fixed", // Fixed view: "fixed"; first-person view: "first-person"; third-person view: "third-person"; top view: "top"; mini-map: "mini-map"
    multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 1.0, 1.0), // Viewport position and size: fraction of window width and window height; MUST BE REDEFINED when creating an instance of ThumbRaiser() so that each view is assigned a different viewport
    target: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
    initialOrientation: new Orientation(135.0, -45.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
    orientationMin: new Orientation(-180.0, -90.0),
    orientationMax: new Orientation(180.0, 0.0),
    initialDistance: 8.0, // Distance to the target and associated limits
    distanceMin: 4.0,
    distanceMax: 100.0,
    initialZoom: 1.0, // Zoom factor and associated limits
    zoomMin: 0.25,
    zoomMax: 100.0,
    initialFov: 45.0, // Field-of-view (expressed in degrees)
    near: 0.01, // Front clipping plane
    far: 100.0 // Back clipping plane
}