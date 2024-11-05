import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-get-patient-profiles',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include FormsModule in imports
  templateUrl: './get-patient-profiles.component.html',
  styleUrls: ['./get-patient-profiles.component.css'] // Correct property name
})
export class GetPatientProfilesComponent {
  name: string = '';
  email: string = '';
  dateOfBirth: string = '';
  medicalNumber: number | null = null;
  page: number = 1;
  pageSize: number = 10;

  searchResults: any[] = []; // Initialize as an empty array

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
  }

  onGoBack(): void {
    this.router.navigate(['/admin-ui']);
  }

  onSearch(): void {
    this.page=1;
    this.search();
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  search():void{

    this.searchResults = []; // Reset search results before new search
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
        this.searchResults = Array.isArray(response.patients) ? response.patients : [];
      },
      error => {
        console.error('Error searching patient profiles:', error);
      }
    );
  }
  nextPage(): void {
    if (this.searchResults.length >= this.pageSize) { 
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
