import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include FormsModule in imports
  templateUrl: './update-operation-request.component.html',
  styleUrls: ['./update-operation-request.component.css']
})
export class UpdateOperationRequestComponent implements OnInit {
  operationRequests: any[] = [];
  priorities: any[] = [];
  
  selectedRequestId?: number;
  selectedPriorityId?: number;
  deadline?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadPriorities();
  }

  // Load operation requests from the backend API
  private loadRequests(): void {
    this.authService.getAllRequests().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          console.log('Loaded operation requests:', data);
          this.operationRequests = data;
        } else {
          console.error('Invalid data format for operation requests:', data);
        }
      },
      (error) => {
        console.error('Error loading requests', error);
        alert('Failed to load operation requests');
      }
    );
  }

  // Load priorities from the backend API
  private loadPriorities(): void {
    this.authService.getAllPriorities().subscribe(
      (data) => {
        console.log('Loaded priorities:', data);
        this.priorities = data;
      },
      (error) => {
        console.error('Error loading priorities', error);
        alert('Failed to load priorities');
      }
    );
  }
  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // Update the operation request with selected priority and deadline
  updateOperationRequestAsDoctor(): void {
    if (this.selectedRequestId) {
      let formattedDeadline;
      if(this.deadline){
       formattedDeadline = this.deadline ? this.formatDateToDDMMYYYY(new Date(this.deadline)) : undefined;
      }
      // Call the API with the formatted deadline
      this.authService.updateOperationRequestAsDoctor(
        this.selectedRequestId,
        this.selectedPriorityId,
        formattedDeadline
      ).subscribe(
        () => {
          alert('Operation Request Updated!');
          this.resetForm();

        },
        (error) => {
          console.error('Error updating operation request', error);
          alert('You only have permission to update your own requests!');
        }
      );
    } else {
      alert('Please select a valid Operation Request');
    }
  }
  private resetForm(): void {
    this.selectedRequestId = undefined;
    this.selectedPriorityId = undefined;
    this.deadline = undefined;
    this.loadRequests(); 
  }

}
