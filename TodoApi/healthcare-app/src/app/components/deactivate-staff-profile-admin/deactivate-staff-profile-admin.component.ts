import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-deactivate-staff-profile-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './deactivate-staff-profile-admin.component.html',
  styleUrls: ['./deactivate-staff-profile-admin.component.css']
})
export class DeactivateStaffProfileAdminComponent {
  staffId?: number;
  isConfirmed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Method to call the service and deactivate the staff profile
  deactivateStaffProfile() {
    if (!this.staffId) {
      alert('Please provide a valid staff ID.');
      return;
    }
  
    this.authService.deactivateStaffByIdAsAdmin(this.staffId).subscribe({
      next: () => {
        alert('Staff profile has been successfully deactivated.');
        this.router.navigate(['/admin-dashboard']); // Navigate to dashboard
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 200) {
          // Handle Angular misinterpreting a successful response
          alert('Staff profile has been successfully deactivated.');
          this.router.navigate(['/admin-dashboard']); // Navigate to dashboard
        } else {
          if (error.status === 404) {
            alert('Staff member not found.');
          } else if (error.status === 400) {
            alert('Staff member is already deactivated.');
          } else {
            console.error('Error deactivating staff profile:', error);
            alert('An error occurred while deactivating the staff profile.');
          }
        }
      }
    });
  }  
}
