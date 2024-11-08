import { Component } from '@angular/core';
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
export class ListOperationTypesComponent {
  searchParams: OperationTypeSearch = {
    name: '',
    specialization: '',
    status: -1
  };

  operationTypes: any[] = []; // Holds the response data
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }

  onSearch(): void {
    this.authService.getFilteredOperationTypes(this.searchParams).subscribe(
      (response) => {
        this.operationTypes = response;
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'No matching operation types found.';
        this.operationTypes = [];
      }
    );
  }
}
