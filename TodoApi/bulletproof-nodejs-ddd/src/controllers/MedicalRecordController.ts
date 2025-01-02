// src/controllers/medicalRecordController.ts
import { Request, Response } from "express";
import MedicalRecordService from "../services/MedicalRecordService";

class MedicalRecordController {
    // Create a new medical record
    async create(req: Request, res: Response): Promise<void> {
        try {
            const record = await MedicalRecordService.createRecord(req.body);
            res.status(201).json(record);
        } catch (error) {
            res.status(500).json({ message: "Error creating medical record", error });
        }
    }

    // List all medical records
    async list(req: Request, res: Response): Promise<Response> {
        try {
            const records = await MedicalRecordService.getAllMedicalRecords();

            if (records.length === 0) {
                return res.status(404).json({ message: "No medical records found." });
            }

            return res.status(200).json({ data: records });
        } catch (error) {
            console.error("Error listing medical records:", error);
            return res.status(500).json({ message: "Failed to list medical records.", error });
        }
    }
}

export default new MedicalRecordController();
