import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService'; // Import UserService

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  userEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.updateProfileForm = this.fb.group({
      newEmail: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      emergencyContact: [''],
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.userEmail;

    // Fetch the user's profile and populate the form
    if (this.userEmail) {
      this.authService.getPatientByEmail(this.userEmail).subscribe(
        (profile) => {
          this.updateProfileForm.patchValue({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            emergencyContact: profile.emergencyContact || '',
          });
        },
        (error) => {
          console.error('Error fetching patient profile:', error);
          alert('Error fetching patient profile information.');
        }
      );
    } else {
      console.error('User email is not available.');
      alert('User email is not available. Please log in again.');
    }
  }

  onSubmit() {
    const { newEmail, firstName, lastName, phone, emergencyContact } = this.updateProfileForm.value;
    const email = this.userEmail;

    if (email) {
      this.authService
        .updatePatientProfile(email, newEmail, firstName, lastName, phone, emergencyContact)
        .subscribe(
          () => {
            console.log('Profile updated successfully');
            alert('Your profile has been updated!');
          },
          (error) => {
            console.error('Error updating profile:', error);
            alert('Error while trying to update your profile.');
          }
        );
    } else {
      console.error('User email is not available.');
      alert('User email is not available. Please log in again.');
    }
  }

  
}
