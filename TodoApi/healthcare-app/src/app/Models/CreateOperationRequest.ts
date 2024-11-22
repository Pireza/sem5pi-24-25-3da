export interface CreateOperationRequest {
  patientId: number; 
  operationTypeId: number;
  priorityId: number;
  deadline: string;
}
