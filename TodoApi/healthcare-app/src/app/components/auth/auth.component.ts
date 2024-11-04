import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role
  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  onAuthenticate() {
    this.authService.authenticateUser().subscribe({
      next: (response) => {
        // Check authentication status and update user role after authentication
        if (this.authService.isAuthenticated) {
          this.userEmail = this.authService.userEmail; // Update email here
          this.userRole = this.authService.userRole;   // Update role here
  
          // Now check the userRole
          if (this.userRole === 'Patient') {
            this.router.navigate(['/patient-ui']); // Navigate to Patient UI
          }
        }
      },
      error: (error) => {
        console.error('Authentication failed:', error);
        // Handle errors (e.g., show a message to the user)
      }
    });
  }
  
  onCreateAccountClient(){
    this.router.navigate(['/registerClient']);

  }

}
