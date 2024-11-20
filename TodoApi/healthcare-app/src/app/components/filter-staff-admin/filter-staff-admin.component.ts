import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { StaffProfileSearch } from '../../Models/StaffProfileSearch'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter-staff-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-staff-admin.component.html',
  styleUrl: './filter-staff-admin.component.css'
})

export class SearchStaffProfileAdminComponent {
  name: string = '';
  email: string = '';
  page: number = 1;
  specialization: number = 0;
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
    this.specialization = 0;
    this.searchResults = [];
    this.totalRecords = 0;
  }



 onSearch(): void {
  console.log('Search method triggered');
  this.page = 1;  // Reset to page 1 for new search
  this.search();
}


  search(): void {
    this.searchResults = [];
    console.log('Sending search request with the following parameters:');
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Page:', this.page);
    console.log('Specialization:', this.specialization);
    console.log('Page Size:', this.pageSize);
    

    this.authService.searchStaffProfiles(
      this.name,
      this.email,
      this.specialization,
      this.page,
      this.pageSize
  ).subscribe(
      response => {
          console.log('Received response:', response);
          this.totalRecords = response.totalRecords;
          this.searchResults = Array.isArray(response.staff) ? response.staff : [];
      },
      error => {
          console.error('Error searching staff profiles:', error);
      }
  );
  
  
  }

  
  nextPage(): void {
    if (this.page * this.pageSize < this.totalRecords) {
        this.page++;
        console.log('Next page:', this.page); // Debug log
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
