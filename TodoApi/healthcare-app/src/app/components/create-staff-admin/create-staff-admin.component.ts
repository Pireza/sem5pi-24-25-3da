import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreateStaffRequest } from '../../Models/CreateStaffRequest';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff-admin.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./create-staff-admin.component.css']
})
export class CreateStaffAdminComponent {
  // Initialize staffRequest object with the appropriate structure
  staffRequest: CreateStaffRequest = {
    username: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
    phone: '',
    email: '',
    role: '',
    specialization: {
      specId: 0,
      specDescription: ''
    },
    availabilitySlots: []
  };

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle form submission
  onSubmit() {
    // Ensure all required fields are filled out
    if (!this.staffRequest.firstName || !this.staffRequest.lastName || !this.staffRequest.licenseNumber || !this.staffRequest.phone || !this.staffRequest.email || !this.staffRequest.username) {
      alert('Please fill in all required fields!');
      return;
    }

    // Log the staffRequest object to make sure it's populated correctly
    console.log('Staff request data:', this.staffRequest);

    // Call the AuthService to create the staff as admin
    this.authService.createStaffAsAdmin(this.staffRequest).subscribe({
      next: () => {
        console.log('Staff created successfully');
        this.router.navigate(['/admin-ui']); // Navigate to admin dashboard after success
      },
      error: (error) => {
        console.error('Error creating staff:', error);
        if (error.error) {
          alert(`Error: ${error.error.message || 'Unknown error'}`);
        } else {
          alert('An error occurred while creating the staff.');
        }
      }
    });
  }
}
