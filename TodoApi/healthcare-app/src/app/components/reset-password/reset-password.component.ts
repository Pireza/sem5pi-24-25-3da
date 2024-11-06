import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: String = ''; 

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.resetPassword(this.email).subscribe({
      error: (error) => {
        console.error('Error sending email:', error);
      }
    });
  }
}

