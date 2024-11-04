import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-ui',
  templateUrl: './patient-ui.component.html', // Adjust the path as necessary
  styleUrls: ['./patient-ui.component.css'] // Adjust the path as necessary
})
export class PatientUIComponent implements OnInit {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userEmail = this.authService.userEmail; // Get the user's email from AuthService
    this.userRole = this.authService.userRole;   // Get the user's role from AuthService
  }
}
