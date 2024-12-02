import express, { Request, Response, NextFunction } from 'express';
import { addAllergy } from '../../controllers/allergyController';
import { getPatientInfo } from '../middlewares/patientMiddleware'; // Import the middleware

const router = express.Router();

// Route to add new allergy, ensures patient info is validated before adding the allergy
router.post('/api/createAllergy', getPatientInfo, addAllergy);

export default router;
