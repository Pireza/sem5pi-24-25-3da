import { MedicalRecord } from "./MedicalRecord";

export interface MedicalRecordWithDetails extends MedicalRecord {
    patient?: any;     // Assuming patient data is of any type, you can replace `any` with the appropriate type.
    condition?: any;   // Same as above for condition.
    allergy?: any;     // Same as above for allergy.
  }
  