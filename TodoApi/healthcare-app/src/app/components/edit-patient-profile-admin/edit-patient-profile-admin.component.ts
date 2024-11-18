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

  availableEmails: string[] = [];
  newCondition: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadAvailableEmails();
  }

  // Load the list of available patient emails
  loadAvailableEmails() {
    this.authService.getPatientEmails().subscribe({
      next: (emails) => {
        this.availableEmails = emails;
      },
      error: (error) => {
        console.error('Error fetching emails:', error);
      }
    });
  }

  // Load patient data based on selected email
  loadPatientData(email: string) {
    if (!email) {
      console.error('Email is invalid or missing.');
      return;
    }

    this.authService.getPatientByEmail(email).subscribe({
      next: (data) => {
        this.patient = data;
      },
      error: (err) => {
        console.error('Error loading patient data:', err);
      }
    });
  }

  onSubmit() {
    if (!this.patient.email) {
      alert('Email is required!');
      return;
    }
  
    this.authService.updatePatientAsAdmin(this.patient).subscribe({
      next: () => {
        console.log('Patient updated successfully');
        alert('Patient updated successfully');
  
        // Clear all fields
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        alert('Error updating patient profile!');
      }
    });
  }

  resetForm() {
    this.patient = {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      emergencyContact: '',
      medicalConditions: []
    };
    this.newCondition = '';
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
