import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreatePatientRequest } from '../../Models/CreatePatientRequest';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-patient',
  standalone: true, // Indicate this is a standalone component
  imports: [CommonModule, FormsModule], // Include FormsModule here
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css'],
})
export class RegisterPatientComponent {
  termsAccepted: boolean = false;

  patient: CreatePatientRequest = {
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
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) {}

  addCondition() {
    if (this.newCondition.trim()) {
      this.patient.medicalConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(index: number) {
    this.patient.medicalConditions.splice(index, 1);
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
    const rawBirthday = this.patient.birthday; // Get the current birthday value
    const date = new Date(rawBirthday); // Convert to Date object

    // Format the birthday to dd/MM/yyyy
    this.patient.birthday = this.formatDateToDDMMYYYY(date); // Update the birthday in the client object
    if (this.termsAccepted) {
    this.authService.registerPatient(this.patient).subscribe({
      next: () => {
        this.errorMessage = '';
        this.authService.isAuthenticated=false;
        alert('Patient registered successfully');
        this.router.navigate(['/auth']); 
      },
      error: (error) => {
        if (error.status === 400) {
          // Check for specific error message from the server response
          if (error.error) {
            console.log(error.error);
            switch (error.error) {
              case 'User already exists in the system':
                this.errorMessage = 'A user with this email or username already exists. Please use a different email or username.';
                break;
              case 'An error occurred while saving the entity changes. See the inner exception for details.':
                this.errorMessage = 'A user with this telephone number or medical number already exists. Please use a different phone number or medical number.';
                break;
              default:
                this.errorMessage = 'There was a problem with the information provided. Please check your details and try again.';
            }
          } else {
            this.errorMessage = 'A validation error occurred. Please check your input.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }}
  goBack(): void {
    this.router.navigate(['/auth']);
  }

}
