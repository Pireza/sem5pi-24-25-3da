import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-staff',
  templateUrl: './edit-staff-admin.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-staff-admin.component.css']
})
export class EditStaffAdminComponent {
  // Initialize the staff update request
  staffUpdateRequest = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specializationId: undefined as number | undefined, // Changed to undefined instead of null
    role: '',
    availabilitySlots: []
  };
  

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle form submission
  onSubmit() {
    // Ensure all required fields are filled out
    if (!this.staffUpdateRequest.email) {
      alert('Please fill in all required fields!');
      return;
    }

    // Call AuthService to update staff profile as admin
    this.authService.updateStaffProfileAsAdmin(
      this.staffUpdateRequest.email,
      this.staffUpdateRequest.firstName,
      this.staffUpdateRequest.lastName,
      this.staffUpdateRequest.phone,
      this.staffUpdateRequest.specializationId,
      this.staffUpdateRequest.role,
      this.staffUpdateRequest.availabilitySlots
    ).subscribe({
      next: () => {
        console.log('Staff updated successfully');
        this.router.navigate(['/admin-ui']); // Navigate to admin dashboard after success
      },
      error: (error) => {
        console.error('Error updating staff:', error);
        if (error.error) {
          alert(`Error: ${error.error.message || 'Unknown error'}`);
        } else {
          alert('An error occurred while updating the staff.');
        }
      }
    });
  }
}
