// src/services/appointmentService.ts
import { ISurgeryAppointment } from "../Models/Interfaces/SurgeryAppointmentInterface";
import AppointmentRepository from "../repos/AppointmentRepository";

class AppointmentService {
    // Create a new appointment
    async createAppointment(appointment: ISurgeryAppointment): Promise<ISurgeryAppointment> {
        return await AppointmentRepository.create(appointment);
    }

    // Get all appointments
    async getAllAppointments(): Promise<ISurgeryAppointment[]> {
        return await AppointmentRepository.findAll();
    }

    // Get an appointment by ID
    async getAppointmentById(id: string): Promise<ISurgeryAppointment | null> {
        return await AppointmentRepository.findById(id);
    }

    async updateAppointment(id: string, updateData: Partial<ISurgeryAppointment>): Promise<ISurgeryAppointment | null> {
        return await AppointmentRepository.updateById(id, updateData);
    }
    
}

export default new AppointmentService();
