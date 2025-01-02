// src/routes/medicalRecordRoutes.ts
import express from "express";
import MedicalRecordController from "../../controllers/MedicalRecordController";

const router = express.Router();

router.post("/api/medical-records", MedicalRecordController.create);

export default router;
