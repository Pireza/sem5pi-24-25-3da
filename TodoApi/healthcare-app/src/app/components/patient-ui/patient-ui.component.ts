import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { UserService } from '../../services/userService'; // Import UserService


@Component({
  selector: 'app-patient-ui',
  templateUrl: './patient-ui.component.html', // Adjust the path as necessary
  styleUrls: ['./patient-ui.component.css'] // Adjust the path as necessary
})
export class PatientUIComponent implements OnInit {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userEmail = this.userService.userEmail; // Get the user's email from AuthService
    this.userRole = this.userService.userRole;   // Get the user's role from AuthService
  }
  onDeletePatient(): void {
    if (this.userEmail) {
      const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmation) {

      this.authService.deletePatientByEmail(this.userEmail).subscribe({
        next: () => {
          console.log('Patient deleted successfully');
          alert('Your account will be deleted in 30 days as per RGPD standarts.');
          this.router.navigate(['/auth']);
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
          alert('An error occurred while trying to delete the patient.');
        }
      });
    }
    } else {
      alert('User email is not available.');
    }
  }
  onUpdateProfile(): void {
    this.router.navigate(['/update-profile']); // Navigate to Update Profile component
  }
  goBack(): void {
    this.router.navigate(['/auth']);
  }
}
