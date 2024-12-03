import express, { Request, Response, NextFunction } from 'express';
import { getPatientInfo } from '../middlewares/patientMiddleware'; // Import the middleware
import { AllergyController } from '../../controllers/allergyController';
import { AllergyService } from '../../services/AllergyService';
import { AllergyRepository } from '../../repos/AllergyRepository';

const router = express.Router();

const allergyRepository = new AllergyRepository();
const allergyService = new AllergyService(allergyRepository);
const allergyController = new AllergyController(allergyService);

// Route to add new allergy, ensures patient info is validated before adding the allergy
router.post('/api/createAllergy', getPatientInfo, allergyController.addAllergy);
router.get('/api/getAllAllergies', (req, res) => allergyController.listAllergies(req, res));

export default router;
