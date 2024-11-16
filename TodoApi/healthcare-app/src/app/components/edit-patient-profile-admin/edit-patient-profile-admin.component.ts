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
export class EditPatientProfileAdminComponent implements OnInit {
  patient: Patient = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    emergencyContact: '',
    medicalConditions: []
  };

  availableEmails: string[] = [];  // To store available emails
  newCondition: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadAvailableEmails();
  }

  // Load the list of available patient emails
  loadAvailableEmails() {
    this.authService.getPatientEmails().subscribe({
      next: (emails) => {
        this.availableEmails = emails;  // Assuming the API returns a list of emails
      },
      error: (error) => {
        console.error('Error fetching emails:', error);
      }
    });
  }

  // Load patient data based on selected email
  loadPatientData(email: string) {
    if (email) {
      this.authService.getPatientByEmail(email).subscribe({
        next: (data) => {
          // Auto-fill the form with the patient data
          this.patient.firstName = data.firstName;
          this.patient.lastName = data.lastName;
          this.patient.phone = data.phone;
          this.patient.emergencyContact = data.emergencyContact;
          this.patient.medicalConditions = data.medicalConditions || [];
        },
        error: (error) => {
          console.error('Error loading patient data:', error);
        }
      });
    }
  }

  onSubmit() {
    if (!this.patient.email) {
      alert('Email is required!');
      return;
    }

    this.authService.updatePatientAsAdmin(this.patient).subscribe({
      next: () => {
        console.log('Patient updated successfully');
        this.router.navigate(['/admin-ui']);
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        alert('Error updating patient profile!');
      }
    });
  }

  addCondition() {
    if (this.newCondition.trim()) {
      this.patient.medicalConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(index: number) {
    this.patient.medicalConditions.splice(index, 1);
  }
}
