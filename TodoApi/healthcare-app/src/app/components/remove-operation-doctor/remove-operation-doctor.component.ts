import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-delete-operation-request',
  templateUrl: './remove-operation-doctor.component.html',
  styleUrls: ['./remove-operation-doctor.component.css']
})
export class DeleteOperationRequestComponent {
  operationRequestId?: number; // Define operationRequestId as optional

  constructor(private authService: AuthService, private router: Router) {}

  deleteOperationRequest(): void {
    if (this.operationRequestId != null) { // Check if operationRequestId is defined
      this.authService.deleteOperationRequestAsDoctor(this.operationRequestId).subscribe({
        next: () => {
          console.log('Operation request deleted successfully');
          this.router.navigate(['/doctor-ui']); // Redirect after deletion
        },
        error: (error) => {
          console.error('Error deleting operation request:', error);
          alert('Failed to delete operation request. Please try again.');
        }
      });
    } else {
      alert('Please enter a valid operation request ID.');
    }
  }
}
