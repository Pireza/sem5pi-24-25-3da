import mongoose, {  Schema } from 'mongoose';
import { IMedicalRecord } from "./Interfaces/MedicalRecordInterface";

const MedicalRecordSchema: Schema<IMedicalRecord> = new mongoose.Schema(
{
    PatientId: { type: String, required: true, unique: false },
    MedicalConditionId: { type: String, required: true, unique: false },
    AllergyId: { type: String, required: true, unique: false },
}
);

const MedicalRecord= mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
export default MedicalRecord;