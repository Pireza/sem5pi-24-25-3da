import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AvailabilitySlot, Staff } from '../../Models/Staff';  

@Component({
  selector: 'app-create-staff',
  templateUrl: './edit-staff-admin.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-staff-admin.component.css']
})
export class EditStaffAdminComponent implements OnInit {
  staffUpdateRequest = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    role: '',
    specializationId: undefined as number | undefined, // Not used directly in the form, but can map specialization later
    specializationDescription: '',  // For displaying specialization description
    availabilitySlots: [] as AvailabilitySlot[]  // For storing availability slots
  };

  staffEmails: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getStaffEmails();
  }

  // Fetch the list of staff emails from the backend
  getStaffEmails(): void {
    this.authService.getStaffEmails().subscribe(
      (emails: string[]) => {
        this.staffEmails = emails;
      },
      (error) => {
        console.error('Error fetching staff emails:', error);
      }
    );
  }

  // Fetch staff details based on the selected email
  onEmailChange(email: string): void {
    this.authService.getStaffByEmail(email).subscribe(
      (staff: Staff) => {
        this.staffUpdateRequest.firstName = staff.firstName;
        this.staffUpdateRequest.lastName = staff.lastName;
        this.staffUpdateRequest.phone = staff.phone;
        this.staffUpdateRequest.licenseNumber = staff.licenseNumber;
        this.staffUpdateRequest.role = staff.role;
  
        // Make sure to parse the specializationId to a number
        this.staffUpdateRequest.specializationId = staff.specialization.specId; // Assuming specId is a number
  
        this.staffUpdateRequest.specializationDescription = staff.specialization.specDescription;
        this.staffUpdateRequest.availabilitySlots = staff.availabilitySlots;
      },
      (error) => {
        console.error('Error fetching staff details:', error);
      }
    );
  }

  onSubmit(): void {
    // Ensure all required fields are filled
    if (!this.staffUpdateRequest.email || !this.staffUpdateRequest.firstName || !this.staffUpdateRequest.lastName) {
      alert('Please fill in all required fields!');
      return;
    }
  
    // Ensure specializationId is a number
    if (this.staffUpdateRequest.specializationId != null) {
      this.staffUpdateRequest.specializationId = Number(this.staffUpdateRequest.specializationId);
    }
  
    // Call the updateStaffProfileAsAdmin method directly from AuthService
    this.authService.updateStaffProfileAsAdmin(this.staffUpdateRequest).subscribe({
      next: () => {
        console.log('Staff updated successfully');
        alert('Staff updated successfully');
        
        // Reset the form and fetch the staff emails again
        this.resetForm();
        this.getStaffEmails(); // Re-fetch the email list after reset
      },
      error: (error) => {
        console.error('Error updating staff:', error);
        alert(`Error: ${error.error?.message || 'Unknown error'}`);
      }
    });
  }
  
  
  resetForm(): void {
    this.staffUpdateRequest = {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      licenseNumber: '',
      role: '',
      specializationId: undefined as number | undefined,
      specializationDescription: '',
      availabilitySlots: [] as AvailabilitySlot[]
    };
    // Optionally clear the emails list if you want to force a refetch
    this.staffEmails = [];
  }
  
}
