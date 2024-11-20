import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include FormsModule in imports
  templateUrl: './remove-operation-doctor.component.html',
  styleUrls: ['./remove-operation-doctor.component.css']
})
export class DeleteOperationRequestComponent implements OnInit {
  operationRequests: any[] = [];
  selectedRequestId?: number;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadRequests();
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

  // Delete the selected operation request
  deleteOperationRequest(): void {
    if (this.selectedRequestId) {
      this.authService.deleteOperationRequestAsDoctor(this.selectedRequestId).subscribe(
        () => {
          alert('Operation Request Deleted!');
          this.resetForm();
        },
        (error) => {
          console.error('Error deleting operation request', error);
          alert('Failed to delete operation request');
        }
      );
    } else {
      alert('Please select a valid Operation Request');
    }
  }

  // Reset the form after successful deletion
  public resetForm(): void {
    this.selectedRequestId = undefined;
    this.loadRequests(); // Reload the requests after reset
  }
}
