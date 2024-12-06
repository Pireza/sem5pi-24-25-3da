import { Request, Response } from 'express';
import { MedicalConditionService } from '../services/MedicalConditionService';

class MedicalConditionController {
    private medicalConditionService: MedicalConditionService;

    constructor(medicalConditionService: MedicalConditionService) {
        this.medicalConditionService = medicalConditionService;
    }

    public addMedicalCondition = async (req: Request, res: Response): Promise<void | Response> => {
        try {
            const { code, codeSystem, designation, description, commonSymptoms } = req.body;
            const condition = await this.medicalConditionService.addMedicalCondition(code, codeSystem, designation, description, commonSymptoms);

            res.status(201).json({ message: 'Medical condition added successfully', data: condition });
        } catch (error) {
            if (error.message === 'A medical condition with this code already exists') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };

    public async listMedicalConditions(req: Request, res: Response): Promise<Response> {
        try {
            const conditions = await this.medicalConditionService.getAllMedicalConditions();
            if (conditions.length === 0) {
                return res.status(404).json({ message: 'No medical conditions found.' });
            }
            return res.status(200).json({ data: conditions });
        } catch (error) {
            console.error('Error listing medical conditions:', error);
            return res.status(500).json({ message: 'Failed to list medical conditions.', error });
        }
    }
}

export { MedicalConditionController };
