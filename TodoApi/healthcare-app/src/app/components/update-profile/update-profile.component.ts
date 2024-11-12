import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService'; // Import UserService

@Component({
  selector: 'app-update-profile',
  standalone: true, // Add this line to make it a standalone component
  imports: [ReactiveFormsModule], // Include ReactiveFormsModule here
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  userEmail: string | null = null; // To hold the user's email

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {
    this.updateProfileForm = this.fb.group({
      newEmail: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      emergencyContact: [''],
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.userEmail; // Get the user's email from AuthService
  }

  onSubmit() {
    const { newEmail, firstName, lastName, phone, emergencyContact } = this.updateProfileForm.value;
    const email = this.userEmail; // Get the user's email from the service

    // Check if email is not null before proceeding
    if (email) {
      this.authService.updatePatientProfile(email, newEmail, firstName, lastName, phone, emergencyContact)
        .subscribe(() => {
          console.log('Profile updated successfully');
          alert('Your profile has been updated!');
          this.router.navigate(['/patient-ui']); // Redirect to patient-ui
        }, (error) => {
          console.error('Error updating profile:', error);
          alert('Error while trying to update your profile.');
        });
    } else {
      console.error('User email is not available.');
      alert('User email is not available. Please log in again.');
    }
  }
  goBack(): void {
    this.router.navigate(['/patient-ui']);
  }
}
