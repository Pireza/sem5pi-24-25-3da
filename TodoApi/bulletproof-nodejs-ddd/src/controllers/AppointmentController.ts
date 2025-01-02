// src/controllers/appointmentController.ts
import { Request, Response } from "express";
import AppointmentService from "../services/AppointmentService";

class AppointmentController {
    // Create a new appointment
    async create(req: Request, res: Response): Promise<void> {
        try {
            const appointment = await AppointmentService.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error) {
            console.error("Error creating appointment:", error);
            res.status(500).json({ message: "Error creating appointment", error });
        }
    }

    // Get all appointments
    async list(req: Request, res: Response): Promise<Response> {
        try {
            const appointments = await AppointmentService.getAllAppointments();
            if (appointments.length === 0) {
                return res.status(404).json({ message: "No appointments found." });
            }
            return res.status(200).json({ data: appointments });
        } catch (error) {
            console.error("Error listing appointments:", error);
            return res.status(500).json({ message: "Failed to list appointments.", error });
        }
    }

    // Get appointment by ID
    async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const appointment = await AppointmentService.getAppointmentById(id);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            return res.status(200).json({ data: appointment });
        } catch (error) {
            console.error("Error fetching appointment by ID:", error);
            return res.status(500).json({ message: "Failed to fetch appointment.", error });
        }
    }
}

export default new AppointmentController();
