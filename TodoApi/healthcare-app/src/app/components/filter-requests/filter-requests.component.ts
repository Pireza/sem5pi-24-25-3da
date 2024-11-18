import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import the AuthService
import { OperationRequestSearch } from '../../Models/OperationRequestSearch'; // Import the interface
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-filter-requests',
  templateUrl: './filter-requests.component.html',
  styleUrls: ['./filter-requests.component.css'],
})
export class FilterRequestsComponent {
  search: OperationRequestSearch = {
    patientName: '',
    operationType: '',
    priority: '',
    status: ''
  }; // Initialize with empty search criteria
  requests: any[] = []; // Holds the filtered requests

  constructor(private authService: AuthService) {}

  // Search for requests based on criteria
  onSearch(): void {
    this.authService.searchOperationRequests(this.search).subscribe(
      (response) => {
        this.requests = response; // Store the response data in the requests array
      },
      (error) => {
        console.error('Error fetching operation requests:', error);
      }
    );
  }

 
  
}
