import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-records',
  templateUrl: './search-records.component.html',
  styleUrls: ['./search-records.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class SearchRecordsComponent implements OnInit {
  medicalRecords: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords() {
    this.authService.searchMedicalRecords().subscribe(
      async (response: any) => {
        const records = Array.isArray(response) ? response : response.data || [];
        console.log(records);
      
        for (const record of records) {
          console.log(record.patientId);
  
          if (record.PatientId) {
            try {
              const patient = await this.authService.getPatientById(record.PatientId).toPromise();
              record.patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
            } catch (error) {
              console.error(`Error fetching patient for ID: ${record.PatientId}`, error);
              record.patientName = 'Unknown';
            }
          } else {
            record.patientName = 'Unknown';
          }
  
          if (record.MedicalConditionId) {
            try {
              const conditionResponse = await this.authService.getMedicalConditionById(record.MedicalConditionId).toPromise();
              record.conditionName = conditionResponse?.data?.designation || 'Unknown';
            } catch (error) {
              console.error(`Error fetching medical condition for ID: ${record.MedicalConditionId}`, error);
              record.conditionName = 'Unknown';
            }
          } else {
            record.conditionName = 'Unknown';
          }
  
          if (record.AllergyId) {
            try {
              const allergyResponse = await this.authService.getAllergyById(record.AllergyId).toPromise();
              record.allergyName = allergyResponse?.data?.name || 'Unknown';
            } catch (error) {
              console.error(`Error fetching allergy for ID: ${record.AllergyId}`, error);
              record.allergyName = 'Unknown';
            }
          } else {
            record.allergyName = 'Unknown';
          }
        }
  
        this.medicalRecords = records;
      },
      (error: any) => {
        this.errorMessage = 'Failed to load medical records.';
        this.clearMessagesAfterDelay();
      }
    );
  }
  
  

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
