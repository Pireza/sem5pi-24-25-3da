import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: String = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Sends the request according to the endpoint, passing the user email
   */
  onSubmit() {
    this.authService.resetPassword(this.email).subscribe({
      next: (response: any) => {
        this.isSuccess = true;
        this.message = response.message || "Password reset email sent successfully";
      },
      error: (error: HttpErrorResponse) => {
        this.isSuccess = false;
        this.message = error.error?.message || "Failed to send password reset email";
      }
    });
  }
}

