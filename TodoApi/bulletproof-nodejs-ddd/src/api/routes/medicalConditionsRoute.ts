import express from 'express';
import { MedicalConditionController } from '../../controllers/MedicalConditionController';
import { MedicalConditionService } from '../../services/MedicalConditionService';
import { MedicalConditionRepository } from '../../repos/MedicalConditionRepository';

const router = express.Router();

const medicalConditionRepository = new MedicalConditionRepository();
const medicalConditionService = new MedicalConditionService(medicalConditionRepository);
const medicalConditionController = new MedicalConditionController(medicalConditionService);

router.post('/api/createMedicalCondition', medicalConditionController.addMedicalCondition);
router.get('/api/getAllMedicalConditions', (req, res) => medicalConditionController.listMedicalConditions(req, res));

export default router;
