import { Document } from "mongoose";

// Define an interface for the Room document
interface IRoom extends Document {
    name: string;            // Name of the room
    type: string;            // Type of the room (e.g., consultation, surgery)
    capacity: number;        // Maximum number of people the room can accommodate
    location: string;        // Location or identifier of the room in the facility
    createdAt: Date;         // Date when the room was added to the system
}

export { IRoom }; // Explicitly export the interface for use elsewhere
