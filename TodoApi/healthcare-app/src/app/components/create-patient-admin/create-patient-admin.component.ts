import { Component } from '@angular/core';
import { CreatePatientRequest } from '../../Models/CreatePatientRequest';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-patient-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-patient-admin.component.html',
  styleUrl: './create-patient-admin.component.css'
})
export class CreatePatientAdminComponent {
  client: CreatePatientRequest = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    gender: '',
    medicalNumber: 0,
    phone: '',
    emergencyContact: '',
    medicalConditions: []
  };

  newCondition = '';

  constructor(private authService: AuthService, private router: Router) {}

  addCondition() {
    if (this.newCondition.trim()) {
      this.client.medicalConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(index: number) {
    this.client.medicalConditions.splice(index, 1);
  }

  // Function to format date to dd/MM/yyyy
  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    // Assuming the birthday is currently in 'yyyy-MM-dd' format
    const rawBirthday = this.client.birthday; // Get the current birthday value
    const date = new Date(rawBirthday); // Convert to Date object

    // Format the birthday to dd/MM/yyyy
    this.client.birthday = this.formatDateToDDMMYYYY(date); // Update the birthday in the client object

    this.authService.createPatientAsAdmin(this.client).subscribe({
      next: () => {
        this.authService.isAuthenticated=false;
        alert('Patient created!')
      },
      error: (error) => {
        console.error('Error registering patient:', error);
        // Handle errors (e.g., show an error message to the user)
      }
    });
  }
}


