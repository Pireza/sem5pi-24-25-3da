import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Patient } from '../../Models/Patient';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-patient-profile-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-patient-profile-admin.component.html',
  styleUrls: ['./edit-patient-profile-admin.component.css']
})
export class EditPatientProfileAdminComponent {
  patient: Patient = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    emergencyContact: '',
    medicalConditions: []
  };

  newCondition: string = '';  // Add newCondition property to bind to input

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Optionally, load the patient's data if needed for the initial form state
    // This could be done by calling the API or pre-filling data
  }

  onSubmit() {
    // Ensure the email is provided and is mandatory before making the request
    if (!this.patient.email) {
      alert('Email is required!');
      return;
    }

    // Call AuthService to update patient details
    this.authService.updatePatientAsAdmin(this.patient).subscribe({
      next: () => {
        console.log('Patient updated successfully');
        this.router.navigate(['/admin-ui']); // Navigate to the Admin UI or relevant page
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        alert('Error updating patient profile!'); // Optionally show an error message
      }
    });
  }

  addCondition() {
    if (this.newCondition.trim()) {
      this.patient.medicalConditions.push(this.newCondition.trim());
      this.newCondition = '';  // Clear the input after adding the condition
    }
  }

  removeCondition(index: number) {
    this.patient.medicalConditions.splice(index, 1);
  }
}
