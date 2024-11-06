import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreatePatientRequest } from '../../Models/CreatePatientRequest';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-client',
  standalone: true, // Indicate this is a standalone component
  imports: [CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css'],
})
export class RegisterClientComponent {
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

    this.authService.registerPatient(this.client).subscribe({
      next: () => {
        this.authService.isAuthenticated=false;
        this.router.navigate(['/auth']); 
      },
      error: (error) => {
        console.error('Error registering patient:', error);
        // Handle errors (e.g., show an error message to the user)
      }
    });
  }
}
