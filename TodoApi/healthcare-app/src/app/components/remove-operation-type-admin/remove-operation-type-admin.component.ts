import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { OperationType } from '../../Models/OperationType';

@Component({
  selector: 'app-remove-operation-type-admin',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include FormsModule in imports
  templateUrl: './remove-operation-type-admin.component.html',
  styleUrls: ['./remove-operation-type-admin.component.css']
})
export class RemoveOperationTypeAdminComponent implements OnInit {
  operationTypes: OperationType[] = [];  // Store active operation types
  selectedOperationTypeId?: number; // Bind to the selected operation type ID
  loading = false;  // Loading state
  errorMessage: string | null = null;  // To store error messages

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadActiveOperationTypes();
  }

  // Method to load active operation types from the service
  loadActiveOperationTypes(): void {
    this.loading = true;
    this.authService.getActiveTypes().subscribe({
      next: (response) => {
        this.operationTypes = response;  // Set the list of active operation types
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load operation types.';
        this.loading = false;
        console.error(error);
      }
    });
  }

  // Method to call the service and deactivate the selected operation type
  deactivateOperationType(): void {
    if (!this.selectedOperationTypeId) {
      alert('Please select an operation type to deactivate.');
      return;
    }

    this.authService.deactivateOperationTypeAsAdmin(this.selectedOperationTypeId).subscribe({
      next: () => {
        alert('Operation type deactivated successfully.');
        this.loadActiveOperationTypes();
      },
      error: (error) => {
        console.error('Error deactivating operation type:', error);
        alert('Failed to deactivate operation type.');
      }
    });
  }

}
