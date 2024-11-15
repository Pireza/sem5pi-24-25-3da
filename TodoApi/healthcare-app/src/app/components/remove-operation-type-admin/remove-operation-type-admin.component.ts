import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-remove-operation-type-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './remove-operation-type-admin.component.html',
  styleUrls: ['./remove-operation-type-admin.component.css']
})
export class RemoveOperationTypeAdminComponent {
  operationTypeId?: number; // Property for input field to capture ID

  constructor(private authService: AuthService, private router: Router) {}

  // Method to call the service and deactivate the operation type
  removeOperationType() {
    if (!this.operationTypeId) {
      alert('Please provide an operation type ID.');
      return;
    }

    this.authService.deactivateOperationTypeAsAdmin(this.operationTypeId).subscribe({
      next: () => {
        alert('Operation type deactivated successfully.');
        this.router.navigate(['/admin-dashboard']); // Navigate after success
      },
      error: (error) => {
        console.error('Error deactivating operation type:', error);
        alert('Failed to deactivate operation type.');
      }
    });
  }
}
