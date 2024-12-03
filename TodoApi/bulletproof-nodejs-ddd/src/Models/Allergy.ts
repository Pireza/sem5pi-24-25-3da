import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Allergy document
interface IAllergy extends Document {
    name: string;
    description: string;
    createdAt: Date;
    patientId: number;
}

// Define the Allergy schema
const AllergySchema: Schema<IAllergy> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        patientId: { type: Number, required: true },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create a compound index for patientId and name to enforce uniqueness
AllergySchema.index({ patientId: 1, name: 1 }, { unique: true });

// Create and export the Allergy model
const Allergy = mongoose.model<IAllergy>('Allergy', AllergySchema);

export { IAllergy }; // Explicitly export the interface for use elsewhere
export default Allergy;
