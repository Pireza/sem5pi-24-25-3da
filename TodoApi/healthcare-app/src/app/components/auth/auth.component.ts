import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  onAuthenticate() {
    this.authService.authenticateUser().subscribe({
      next: (response) => {
        if (this.authService.isAuthenticated) {
          this.router.navigate(['/patient-ui']); // Navigate to Patient UI
        }
      },
      error: (error) => {
        console.error('Authentication failed:', error);
        // Handle errors (e.g., show a message to the user)
      }
    });
  }
}
