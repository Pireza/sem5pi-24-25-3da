import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-patient-profiles',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './get-patient-profiles.component.html',
  styleUrls: ['./get-patient-profiles.component.css']
})
export class GetPatientProfilesComponent {
  name: string = '';
  email: string = '';
  dateOfBirth: string = '';
  medicalNumber: number | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchResults: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.clearSearchFields();
  }

  clearSearchFields(): void {
    this.name = '';
    this.email = '';
    this.dateOfBirth = '';
    this.medicalNumber = null;
    this.searchResults = [];
    this.totalRecords = 0;
  }



  onSearch(): void {
    this.page = 1;
    this.search();
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  search(): void {
    this.searchResults = [];
    const formattedDateOfBirth = this.dateOfBirth 
      ? this.formatDateToDDMMYYYY(new Date(this.dateOfBirth))
      : undefined;

    this.authService.searchPatientProfiles(
      this.name,
      this.email,
      formattedDateOfBirth,
      this.medicalNumber !== null ? this.medicalNumber : undefined,
      this.page,
      this.pageSize
    ).subscribe(
      response => {
        console.log('Full response:', response); 
        this.totalRecords = response.totalRecords;
        this.searchResults = Array.isArray(response.patients) ? response.patients : [];
      },
      error => {
        console.error('Error searching patient profiles:', error);
      }
    );
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.totalRecords) {  
      this.page++;
      this.search();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.search();
    }
  }
}
