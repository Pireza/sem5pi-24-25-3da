// src/repos/medicalRecordRepository.ts
import MedicalRecordModel from "../Models/MedicalRecord";
import { IMedicalRecord } from "../Models/Interfaces/MedicalRecordInterface";

class MedicalRecordRepository {
    // Create a new medical record
    async create(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
        const newRecord = new MedicalRecordModel(medicalRecord);
        return await newRecord.save();
    }

    // Fetch all medical records
    async find(): Promise<IMedicalRecord[]> {
        return await MedicalRecordModel.find(); // Fetch all medical records from the database
    }
}

export default new MedicalRecordRepository();
