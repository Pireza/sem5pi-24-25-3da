import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-patient-profile',
  templateUrl: './manage-patient-profile.component.html',
  styleUrls: ['./manage-patient-profile.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ManagePatientProfileComponent implements OnInit {
  patients: any[] = [];
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.authService.getAllPatientsInfo().subscribe(
      (response: any) => {
        this.patients = Array.isArray(response) ? response : response.data || [];
      },
      (error: any) => {
        this.errorMessage = 'Failed to load patients.';
        this.clearMessagesAfterDelay();
      }
    );
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
