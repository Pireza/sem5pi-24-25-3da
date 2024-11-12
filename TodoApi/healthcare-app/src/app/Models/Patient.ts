export interface Patient {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emergencyContact?: string;
  medicalConditions: string[];
}
