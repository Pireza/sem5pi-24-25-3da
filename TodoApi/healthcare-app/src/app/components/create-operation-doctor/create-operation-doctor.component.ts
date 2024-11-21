import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreateOperationRequest } from '../../Models/CreateOperationRequest';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-operation-doctor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-operation-doctor.component.html',
  styleUrls: ['./create-operation-doctor.component.css'],
})
export class CreateOperationDoctorComponent {
  operationRequest: CreateOperationRequest = {
    patientId: 0,
    operationTypeId: 0,
    priorityId: 0,
    deadline: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (
      !this.operationRequest.patientId ||
      !this.operationRequest.operationTypeId ||
      !this.operationRequest.priorityId ||
      !this.operationRequest.deadline
    ) {
      alert('Please fill in all required fields!');
      return;
    }
  
    console.log('Operation request data:', this.operationRequest);
  
    this.authService.createOperationRequestAsDoctor(this.operationRequest).subscribe({
      next: (response: string) => {
        console.log('Response from server:', response);
  
        if (response.includes('Operation request created successfully')) {
          alert(response);
          this.router.navigate(['/doctor-dashboard']);
        } else {
          alert('Unexpected response from the server. Please contact support.');
        }
      },
      error: (error) => {
        console.error('Error creating operation request:', error);
  
        if (error.status === 0) {
          alert('Unable to connect to the server. Please try again later.');
        } else if (error.error && typeof error.error === 'string') {
          alert(`Error: ${error.error}`);
        } else if (error.error && error.error.message) {
          alert(`Error: ${error.error.message}`);
        } else {
          alert('An unknown error occurred. Please contact support.');
        }
      },
    });
  }
  
}
