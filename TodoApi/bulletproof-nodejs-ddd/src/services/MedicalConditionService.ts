import { MedicalConditionRepository } from '../repos/MedicalConditionRepository';
import { IMedicalCondition } from '../Models/Interfaces/MedicalConditionInterface';

class MedicalConditionService {
    private medicalConditionRepository: MedicalConditionRepository;

    constructor(medicalConditionRepository: MedicalConditionRepository) {
        this.medicalConditionRepository = medicalConditionRepository;
    }

    public async addMedicalCondition(code: string, codeSystem: string, designation: string, description: string, commonSymptoms: string[]): Promise<IMedicalCondition> {
        const data = { code, codeSystem, designation, description, commonSymptoms };
        return await this.medicalConditionRepository.createMedicalCondition(data);
    }

    public async getAllMedicalConditions(): Promise<{ code: string; codeSystem: string; designation: string; description: string; commonSymptoms: string[] }[]> {
        return await this.medicalConditionRepository.findAllMedicalConditions();
    }
}

export { MedicalConditionService };
