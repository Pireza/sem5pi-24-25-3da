import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 

@Component({
  selector: 'app-delete-patient-profile-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-patient-profile-admin.component.html',
  styleUrls: ['./delete-patient-profile-admin.component.css']
})
export class DeletePatientProfileAdminComponent {
  patientEmail?: string; // Variable to hold the patient's email
  isConfirmed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Method to call the service and delete the patient profile
  deactivatePatientProfile() {
    if (!this.patientEmail) {
      alert('Please provide a patient email.');
      return;
    }

    // Call the service method to delete the patient profile
    this.authService.deletePatientByEmailAsAdmin(this.patientEmail).subscribe({
      next: () => {
        alert('Patient Profile deactivated successfully.');
        this.router.navigate(['/admin-dashboard']); // Navigate after success
      },
      error: (error) => {
        console.error('Error deactivating patient profile:', error);
        alert('Failed to deactivate patient profile.');
      }
    });
  }
}
