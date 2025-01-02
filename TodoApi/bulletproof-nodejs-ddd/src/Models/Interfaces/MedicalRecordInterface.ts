import { Document } from "mongoose";

interface IMedicalRecord extends Document {
    PatientId: string;
    MedicalConditionId: string;
    AllergyId: string;
}
export { IMedicalRecord };