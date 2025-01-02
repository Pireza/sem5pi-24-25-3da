import { Request, Response } from "express";
import MedicalRecordService from "../services/MedicalRecordService";

class MedicalRecordController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const record = await MedicalRecordService.createRecord(req.body);
            res.status(201).json(record);
        } catch (error) {
            res.status(500).json({ message: "Error creating medical record", error });
        }
    }
}

export default new MedicalRecordController();
