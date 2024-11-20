import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OperationTypeSearch } from '../../Models/OperationTypeSearch';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-list-operation-types',
  templateUrl: './list-operation-types.component.html',
  styleUrls: ['./list-operation-types.component.css']
})
export class ListOperationTypesComponent implements OnInit{
  searchParams: OperationTypeSearch = {
    name: '',
    specialization: '',
    status: -1
  };

  specializations: any[] = [];
  operationTypes: any[] = []; // Holds the response data
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.getSpecsNames().subscribe(
      (s) => {
        this.specializations = s; // Populate the dropdown options
      },
      (error) => {
        console.error('Error fetching operation type names:', error);
      }
    );
  }

  onSearch(): void {
    this.authService.getFilteredOperationTypes(this.searchParams).subscribe(
      (response) => {
        this.operationTypes = response;

        if (!this.operationTypes || this.operationTypes.length === 0) {
          window.alert('No operation types found matching the criteria.');
        }
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'Error fetching operation types:', error;
      }
    );
  }
}
