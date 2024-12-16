import { Request, Response } from 'express';
import { MedicalConditionService } from '../services/MedicalConditionService';
import { AllergyService } from '../services/AllergyService';
import archiver from 'archiver';
import fs from 'fs';

class MedicalHistoryController {
    private medicalConditionService: MedicalConditionService;
    private allergyService: AllergyService;

    constructor(medicalConditionService: MedicalConditionService, allergyService: AllergyService) {
        this.medicalConditionService = medicalConditionService;
        this.allergyService = allergyService;
    }


    public downloadHistory = async (req: Request, res: Response): Promise<void | Response> => {
        const conditions = await this.medicalConditionService.getAllMedicalConditions();
        const allergies = await this.allergyService.getAllAllergies();

        if (conditions.length === 0 && allergies.length === 0) {
            return res.status(404).json({ message: 'No medical conditions or allergies found.' });
        }

        const combinedData = {
            medicalConditions: conditions,
            allergies: allergies,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="medical_history.json"');

        return res.status(200).json(combinedData);
    };


}
export { MedicalHistoryController };
