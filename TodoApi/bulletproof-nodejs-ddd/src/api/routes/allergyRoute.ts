import express, { Request, Response, NextFunction } from 'express';
import { AllergyController } from '../../controllers/allergyController';
import { AllergyService } from '../../services/AllergyService';
import { AllergyRepository } from '../../repos/AllergyRepository';

const router = express.Router();

const allergyRepository = new AllergyRepository();
const allergyService = new AllergyService(allergyRepository);
const allergyController = new AllergyController(allergyService);

// Route to add new allergy, ensures patient info is validated before adding the allergy
router.post('/api/createAllergy', allergyController.addAllergy);
router.get('/api/getAllAllergies', (req, res) => allergyController.listAllergies(req, res));
router.get('/api/getAllIdAllergies', (req, res) => allergyController.listIdAllergies(req, res));
router.get('/api/getAllergiesById/:allergyId', allergyController.getAllergyById.bind(allergyController));
export default router;
