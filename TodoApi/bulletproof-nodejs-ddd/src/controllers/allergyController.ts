import { Request, Response } from 'express';
import { AllergyService } from '../services/AllergyService';

interface Patient {
    Id: number;
}

interface CustomRequest extends Request {
    patient?: Patient;
}

class AllergyController {
    private allergyService: AllergyService;

    constructor(allergyService: AllergyService) {
        this.allergyService = allergyService;
    }

    public addAllergy = async (req: CustomRequest, res: Response): Promise<void | Response> => {
        try {
            const { name, description } = req.body;
            const patientId = req.patient?.Id;

            if (!patientId) {
                return res.status(400).json({ message: 'Patient ID is missing or invalid' });
            }

            const allergy = await this.allergyService.addAllergy(name, description, patientId);

            res.status(201).json({ message: 'Allergy added successfully', data: allergy });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding allergy', error });
        }
    };
    public async listAllergies(req: Request, res: Response): Promise<Response> {
        try {
            const allergies = await this.allergyService.getAllAllergies();
            if (allergies.length === 0) {
                return res.status(404).json({ message: 'No allergies found.' });
            }

            return res.status(200).json({ data: allergies });
        } catch (error) {
            console.error('Error listing allergies:', error);
            return res.status(500).json({ message: 'Failed to list allergies.', error });
        }
    }
}

export { AllergyController };
