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

  deactivatePatientProfile() {
    if (!this.patientEmail) {
      alert('Please provide a patient email.');
      return;
    }

    this.authService.deletePatientByEmailAsAdmin(this.patientEmail).subscribe({
      next: () => {
        // Success: Handle 204 response
        alert('Patient Profile marked for deletion successfully.');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        // Handle different error statuses
        if (error.status === 404) {
          alert('Patient not found. Please check the email address and try again.');
        } else if (error.status === 403) {
          alert('You do not have the necessary permissions to deactivate this profile.');
        } else if (error.status === 400 || error.status === 409) {
          // Check for the PendingDeletionDate conflict
          const errorMessage = error.error.message || 'Patient is already marked for deletion.';
          alert(errorMessage);
        } else {
          console.error('Unexpected error:', error);
          alert('Failed to deactivate patient profile. Please try again later.');
        }
      }
    });
  }
}
