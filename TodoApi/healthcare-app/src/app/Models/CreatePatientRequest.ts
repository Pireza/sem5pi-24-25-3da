// src/app/models/create-patient-request.ts
export interface CreatePatientRequest {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string; // Format: DD/MM/YYYY
    gender: string;
    medicalNumber: number;
    phone: string;
    emergencyContact: string;
    medicalConditions: string[];
  }
  