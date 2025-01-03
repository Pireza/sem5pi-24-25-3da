import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-medical-record',
  templateUrl: './update-medical-record.component.html',
  styleUrls: ['./update-medical-record.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class UpdateMedicalRecordComponent implements OnInit {
  patientId: string = '';
  medicalConditionId: string = '';
  allergyId: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  patients: any[] = [];
  medicalConditions: any[] = [];
  allergies: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadAllergies();
    this.loadMedicalConditions();
  }

  loadPatients() {
    this.authService.getAllPatientsInfo().subscribe(
      (response: any) => {
        this.patients = Array.isArray(response) ? response : response.data || [];
      },
      (error: any) => {
        this.errorMessage = 'Failed to load patients.';
        this.clearMessagesAfterDelay();
      }
    );
  }

  loadMedicalConditions() {
    this.authService.getMedicalConditionsId().subscribe(
      (response: any) => {
        console.log('Medical Conditions Response:', response); // Log the response
        this.medicalConditions = Array.isArray(response) ? response : response.data || [];
      },
      (error: any) => {
        this.errorMessage = 'Failed to load medical conditions.';
        this.clearMessagesAfterDelay();
      }
    );
  }
  
  loadAllergies() {
    this.authService.getIdAllergies().subscribe(
      (response: any) => {
        console.log('Allergies Response:', response); // Log the response
        this.allergies = Array.isArray(response) ? response : response.data || [];
      },
      (error: any) => {
        this.errorMessage = 'Failed to load allergies.';
        this.clearMessagesAfterDelay();
      }
    );
  }

  createMedicalRecord() {
    if (!this.patientId || !this.medicalConditionId || !this.allergyId) {
      this.errorMessage = 'Please fill all required fields.';
      this.clearMessagesAfterDelay();
      return;
    }
    console.log(this.patientId);
    console.log(this.medicalConditionId); 
    console.log(this.allergyId);
    const newRecordData = {
      PatientId: this.patientId,
      MedicalConditionId: this.medicalConditionId,
      AllergyId: this.allergyId
    };

    this.authService.createMedicalRecord(newRecordData).subscribe(
      (response: any) => {
        this.successMessage = 'Medical record created successfully.';
        this.resetForm();
        this.clearMessagesAfterDelay();
      },
      (error: any) => {
        this.errorMessage = error.error || 'Failed to create medical record.';
        this.clearMessagesAfterDelay();
      }
    );
  }

  resetForm() {
    this.patientId = '';
    this.medicalConditionId = '';
    this.allergyId = '';
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
