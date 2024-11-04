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
  medicalNumber: number | null = null; // Allow null initially
  page: number = 1;
  pageSize: number = 10;

  searchResults: any; // To hold search results

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Clear search results and any other necessary state
    this.clearSearchFields();
  }

  clearSearchFields(): void {
    this.name = '';
    this.email = '';
    this.dateOfBirth = '';
    this.medicalNumber = null;
    this.searchResults = null; // Reset search results
  }
  onGoBack(): void {
    // Use Router to navigate back
    this.router.navigate(['/admin-ui']);
  }
  onSearch(): void {
    const formattedDateOfBirth = this.dateOfBirth 
    ? this.formatDateToDDMMYYYY(new Date(this.dateOfBirth))
    : undefined; // Use undefined if dateOfBirth is empty
    
    this.authService.searchPatientProfiles(
      this.name,
      this.email,
      formattedDateOfBirth,
      this.medicalNumber !== null ? this.medicalNumber : undefined, // Convert null to undefined
      this.page,
      this.pageSize
    ).subscribe(
      response => {
     
        console.log('Search results:', response);
        this.searchResults = response; // Store the results for displaying
      },
      error => {
        console.error('Error searching patient profiles:', error);
      }
    );
  }
    // Function to format date to dd/MM/yyyy
    formatDateToDDMMYYYY(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
}
