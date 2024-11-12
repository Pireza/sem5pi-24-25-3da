export interface Specialization {
  specId: number;
  specDescription: string;
}

export interface AvailabilitySlot {
  id: number;
  slot: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface CreateStaffRequest {
  username: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  role: string;
  specialization: Specialization;
  availabilitySlots: AvailabilitySlot[];
}
