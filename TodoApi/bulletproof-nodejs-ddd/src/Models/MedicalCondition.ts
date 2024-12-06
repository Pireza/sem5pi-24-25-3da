import mongoose, { Schema } from "mongoose";
import { IMedicalCondition } from "./Interfaces/MedicalConditionInterface";

const MedicalConditionSchema: Schema<IMedicalCondition> = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        codeSystem: { type: String, required: true },
        designation: { type: String, required: true },
        description: { type: String },
        commonSymptoms: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const MedicalCondition = mongoose.model<IMedicalCondition>('MedicalCondition', MedicalConditionSchema);
export default MedicalCondition;
