import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userService'; // Import UserService
import { ResetPasswordComponent } from '../reset-password/reset-password.component'; // Import the reset-password component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [ResetPasswordComponent, CommonModule]
})
export class AuthComponent {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role
  isPasswordResetMode: boolean = false; // Control the visibility of the reset password form
  isAuthenticated: boolean = false; // Authentication state
  isSidebarOpen: boolean = false; // Sidebar visibility state

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  // Authenticate user
  onAuthenticate() {
    this.authService.authenticateUser().subscribe({
      next: (response) => {
        if (this.authService.isAuthenticated) {
          this.userEmail = this.userService.userEmail;
          this.userRole = this.userService.userRole;
          this.isAuthenticated = true; // Update authentication state
        }
      },
      error: (error) => {
        console.error('Authentication failed:', error);
      }
    });
  }

  // Navigate to account creation
  onCreateAccountClient() {
    this.router.navigate(['/registerClient']);
  }

  // Toggle password reset form
  onPasswordReset() {
    this.isPasswordResetMode = true;
  }

  // Toggle Sidebar Visibility
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
