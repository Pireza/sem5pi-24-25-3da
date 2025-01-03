// src/repos/appointmentRepository.ts
import Appointment from "../Models/Appointment";
import { ISurgeryAppointment } from "../Models/Interfaces/SurgeryAppointmentInterface";

class AppointmentRepository {
    // Create a new appointment
    async create(appointment: ISurgeryAppointment): Promise<ISurgeryAppointment> {
        const newAppointment = new Appointment(appointment);
        return await newAppointment.save();
    }

    // Fetch all appointments
    async findAll(): Promise<ISurgeryAppointment[]> {
        return await Appointment.find();
    }

    // Fetch appointment by ID
    async findById(id: string): Promise<ISurgeryAppointment | null> {
        return await Appointment.findById(id);
    }
}

export default new AppointmentRepository();