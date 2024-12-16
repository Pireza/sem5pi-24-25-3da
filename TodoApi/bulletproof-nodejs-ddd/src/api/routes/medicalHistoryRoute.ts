import express from "express";
import { MedicalConditionController } from "../../controllers/MedicalConditionController";
import { MedicalConditionRepository } from "../../repos/MedicalConditionRepository";
import { MedicalConditionService } from "../../services/MedicalConditionService";
import { AllergyRepository } from "../../repos/AllergyRepository";
import { AllergyService } from "../../services/AllergyService";
import { MedicalHistoryController } from "../../controllers/MedicalHistoryController";

const router = express.Router();

const medicalConditionRepository = new MedicalConditionRepository();
const medicalConditionService = new MedicalConditionService(medicalConditionRepository);


const allergyRepository = new AllergyRepository();
const allergyService = new AllergyService(allergyRepository);

const medicalHistoryController = new MedicalHistoryController(medicalConditionService, allergyService);


router.get('/api/download-medical-history', (req, res) => medicalHistoryController.downloadHistory(req, res));


export default router;
