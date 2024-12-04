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
            const { name,code, codeSystem, description } = req.body;
           

            const allergy = await this.allergyService.addAllergy(name, code, codeSystem, description);

            res.status(201).json({ message: 'Allergy added successfully', data: allergy });
        } catch (error) {
            
            if (error.message === 'An allergy with this code already exists') {
                res.status(400).json({ error: error.message });
            } else {
                // Handle other unexpected errors
                res.status(500).json({ error: 'Internal Server Error' });
            }
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
