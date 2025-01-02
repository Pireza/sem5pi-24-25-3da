import mongoose, {  Schema } from 'mongoose';
import { ISurgeryAppointment } from "./Interfaces/SurgeryAppointmentInterface";

const AppointmentSchema: Schema<ISurgeryAppointment> = new mongoose.Schema(
{
    RequestId: { type: String, required: true, unique: false },
    RoomId: { type: String, required: true, unique: false },
    Date: { type: String, required: true, unique: false },
    Status: { type: String, required: true, unique: false },
}
);

const Appointment= mongoose.model<ISurgeryAppointment>('Appointment', AppointmentSchema);
export default Appointment;