// src/routes/medicalRecordRoutes.ts
import express from "express";
import MedicalRecordController from "../../controllers/MedicalRecordController";

const router = express.Router();

// Route to create a new medical record
router.post("/api/medical-records", MedicalRecordController.create);

// Route to list all medical records
router.get("/api/get-medical-records", MedicalRecordController.list);

export default router;
