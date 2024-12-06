import {IMedicalCondition} from '../Models/Interfaces/MedicalConditionInterface';
import MedicalCondition from '../Models/MedicalCondition';
interface MedicalConditionData {
    code: string;
    codeSystem: string;
    designation: string;
    description: string;
    commonSymptoms: string[];
}

class MedicalConditionRepository {
    public async createMedicalCondition(data: MedicalConditionData): Promise<IMedicalCondition> {
        const existingCondition = await MedicalCondition.findOne({ code: data.code });
        if (existingCondition) {
            throw new Error('A medical condition with this code already exists');
        }
        const medicalCondition = new MedicalCondition(data);
        return await medicalCondition.save();
    }

    public async findAllMedicalConditions(): Promise<Pick<IMedicalCondition, 'code' | 'codeSystem' | 'designation' | 'description' | 'commonSymptoms'>[]> {
        return await MedicalCondition.find({}, 'code codeSystem designation description commonSymptoms -_id').exec();
    }
}

export { MedicalConditionRepository };
