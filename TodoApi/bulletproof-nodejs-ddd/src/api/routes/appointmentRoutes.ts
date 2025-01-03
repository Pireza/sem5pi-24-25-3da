// src/routes/appointmentRoutes.ts
import express from "express";
import AppointmentController from "../../controllers/AppointmentController";

const router = express.Router();

// Route to create a new appointment
router.post("/api/appointments", AppointmentController.create);

// Route to get all appointments
router.get("/api/appointments", AppointmentController.list);

// Route to get an appointment by ID
router.get("/api/appointments/:id", AppointmentController.getById);

// Route to update an appointment by ID
router.put("/api/appointments/:id", AppointmentController.update);


export default router;
