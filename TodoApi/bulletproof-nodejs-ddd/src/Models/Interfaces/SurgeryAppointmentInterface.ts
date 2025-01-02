import { Document } from "mongoose";

interface ISurgeryAppointment extends Document {
    RequestId: string;
    RoomId: string;
    Date: string;
    Status: string;
}
export { ISurgeryAppointment };