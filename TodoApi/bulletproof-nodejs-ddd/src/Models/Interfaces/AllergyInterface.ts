import { Document } from "mongoose";

// Define an interface for the Allergy document
interface IAllergy extends Document {
    name: string;
    code: string;
    codeSystem: string;
    description: string;
    createdAt: Date;
}

export { IAllergy }; // Explicitly export the interface for use elsewhere
