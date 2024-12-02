import { Request, Response } from 'express';
import Allergy from '../Models/Allergy'; // Assuming Allergy model has a method for saving data

interface Patient {
    Id: number; // Adjust the type of 'id' based on your database schema
}

interface CustomRequest extends Request {
    patient?: Patient; // Ensure req.patient is defined with the expected structure
}

const addAllergy = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        const patientId = req.patient?.Id; // Patient info was fetched and added to req.patient by middleware

        if (!patientId) {
             res.status(400).json({ message: 'Patient ID is missing or invalid' });
        }

        // Logging the patient information for debugging purposes
        console.log('Patient Info:', req.patient);
        console.log('Patient ID:', patientId);

        // Create a new allergy and associate it with the patientId
        const allergy = new Allergy({ name, description, patientId });

        // Save the allergy to the database
        await allergy.save();

        res.status(201).json({ message: 'Allergy added successfully', data: allergy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding allergy', error });
    }
};

export { addAllergy };
