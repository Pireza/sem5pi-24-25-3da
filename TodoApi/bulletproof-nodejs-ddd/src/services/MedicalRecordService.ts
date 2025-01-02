// src/services/medicalRecordService.ts
import { IMedicalRecord } from "../Models/Interfaces/MedicalRecordInterface";
import MedicalRecordRepository from "../repos/medicalRecordRepository";
import MedicalConditionModel from "../Models/MedicalCondition";
import AllergyModel from "../Models/Allergy";

class MedicalRecordService {
    async createRecord(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
        await this.validateIds(medicalRecord);
        return await MedicalRecordRepository.create(medicalRecord);
    }

    private async validateIds(medicalRecord: IMedicalRecord): Promise<void> {
        const { MedicalConditionId, AllergyId } = medicalRecord;

        const conditionExists = await MedicalConditionModel.exists({ _id: MedicalConditionId });
        const allergyExists = await AllergyModel.exists({ _id: AllergyId });

        if (!conditionExists) {
            throw new Error("MedicalConditionId does not exist");
        }
        if (!allergyExists) {
            throw new Error("AllergyId does not exist");
        }
    }
}

export default new MedicalRecordService();