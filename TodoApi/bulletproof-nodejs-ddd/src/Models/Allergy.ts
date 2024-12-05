import mongoose, {  Schema } from 'mongoose';
import { IAllergy } from './Interfaces/AllergyInterface';



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

export default Allergy;
