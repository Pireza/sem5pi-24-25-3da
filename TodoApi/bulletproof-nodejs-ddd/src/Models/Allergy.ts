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
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        patientId: { type: Number, required: true },
    }
);

// Create and export the Allergy model
const Allergy = mongoose.model<IAllergy>('Allergy', AllergySchema);

export default Allergy;
