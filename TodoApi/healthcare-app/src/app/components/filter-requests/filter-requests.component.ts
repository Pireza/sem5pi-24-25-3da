import { Component, OnInit } from '@angular/core';
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
export class FilterRequestsComponent implements OnInit { // Implement OnInit
  search: OperationRequestSearch = {
    patientName: '',
    operationType: '',
    priority: '',
    status: ''
  }; // Initialize with empty search criteria
  foundTypes: string[] = []; // Holds operation type names
  requests: any[] = []; // Holds the filtered requests

  constructor(private authService: AuthService) {}

  // Fetch operation type names on component initialization
  ngOnInit(): void {
    this.authService.getOperationTypesNames().subscribe(
      (types) => {
        this.foundTypes = types; // Populate the dropdown options
      },
      (error) => {
        console.error('Error fetching operation type names:', error);
      }
    );
  }

  // Search for requests based on criteria
  onSearch(): void {
    this.authService.searchOperationRequests(this.search).subscribe(
      (response) => {
        this.requests = response; // Store the response data in the requests array
        if (!this.requests || this.requests.length === 0) {
          window.alert('No operation requests found matching the criteria.');
        }
      },
      (error) => {
        console.error('Error fetching operation requests:', error);
      }
    );
  }
}
