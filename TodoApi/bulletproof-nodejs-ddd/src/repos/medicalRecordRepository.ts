// src/repositories/medicalRecordRepository.ts
import MedicalRecordModel from "../Models/MedicalRecord";
import { IMedicalRecord } from "../Models/Interfaces/MedicalRecordInterface";

class MedicalRecordRepository {
    async create(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
        const newRecord = new MedicalRecordModel(medicalRecord);
        return await newRecord.save();
    }
}

export default new MedicalRecordRepository();
