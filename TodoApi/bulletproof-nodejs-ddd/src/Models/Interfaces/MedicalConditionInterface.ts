import { Document } from "mongoose";

interface IMedicalCondition extends Document {
    code: string;
    codeSystem: string;
    designation: string;
    description: string;
    commonSymptoms: string[];
    createdAt: Date;
}
export { IMedicalCondition };
