import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Patient } from '../../Models/Patient';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

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

  patientEmails: string[] = [];  // Store the list of patient emails
  newCondition: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the list of patient emails when the component initializes
    this.authService.getAllPatientEmails().subscribe({
      next: (emails) => {
        this.patientEmails = emails;  // Store the emails in the patientEmails array
      },
      error: (error) => {
        console.error('Error fetching patient emails:', error);
        // Handle error (e.g., show a message to the user)
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
        this.router.navigate(['/admin-ui']);
      },
      error: (error) => {
        console.error('Error updating patient:', error);
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