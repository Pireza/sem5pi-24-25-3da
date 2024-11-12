import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Adjust path as needed
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterStaffRequest } from '../../Models/RegisterStaffRequest';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-register-staff',
  templateUrl: './register-staff.component.html',
  styleUrls: ['./register-staff.component.css']
})
export class RegisterStaffComponent {
  registerForm: FormGroup;
  loading = false; // New loading state

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  /**
   * This will send the request, then wait for the request return
   upon which it will notify the user about success or insuccess
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true; // Start loading

      const formData: RegisterStaffRequest = this.registerForm.value;

      this.authService.registerStaff(formData).subscribe({
        next: () => {
          alert('Staff user registered successfully!');
          this.loading = false; // Stop loading on success
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false; // Stop loading on error
          if (error.status === 400) {
            alert(error.error); // Display specific error message from server
          } else {
            alert('An unexpected error occurred.');
          }
        }
      });
    }
  }
}
