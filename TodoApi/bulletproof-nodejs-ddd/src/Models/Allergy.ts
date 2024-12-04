import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Allergy document
interface IAllergy extends Document {
    name: string;
    code: string;
    codeSystem: string;
    description: string;
    createdAt: Date;
}

// Define the Allergy schema
const AllergySchema: Schema<IAllergy> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required:true, unique: true},
        codeSystem: {type: String, required:true},
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);


// Create and export the Allergy model
const Allergy = mongoose.model<IAllergy>('Allergy', AllergySchema);

export { IAllergy }; // Explicitly export the interface for use elsewhere
export default Allergy;
