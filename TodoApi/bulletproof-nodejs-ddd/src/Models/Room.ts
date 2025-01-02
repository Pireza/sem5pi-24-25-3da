import mongoose, { Schema } from "mongoose";
import { IRoom } from "./Interfaces/RoomInterface";

const RoomSchema: Schema<IRoom> = new mongoose.Schema(
    {
        name: { type: String, required: true },              // Room name
        type: { type: String, required: true },              // Room type (e.g., consultation, surgery)
        capacity: { type: Number, required: true },          // Room capacity
        location: { type: String, required: true },          // Room location or identifier
        createdAt: { type: Date, default: Date.now },        // Creation date
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
