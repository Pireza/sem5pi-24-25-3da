import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-allergy',
  templateUrl: './create-allergy.component.html',
  styleUrls: ['./create-allergy.component.css'],
  imports:[FormsModule,CommonModule],
  standalone: true
})
export class CreateAllergyComponent {
  name: string = '';
  description: string = '';
  patientId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  patients: any[] = []; // Array to hold patient data

  constructor(private allergyService: AuthService) {}
  ngOnInit() {
    // Fetch all patients when the component is initialized
    this.allergyService.getAllPatientsInfo().subscribe(
      (response: any) => {
        this.patients = response; // Assuming the response contains the list of patients
      },
      (error: any) => {
        this.errorMessage = 'Error fetching patients. Please try again.';
        console.error('Error:', error);
      }
    );
  }
  createNewAllergy() {
    if (this.name && this.description && this.patientId !== null) {
      this.allergyService.createAllergies(this.name, this.description, this.patientId).subscribe(
        (response: any) => {
          this.successMessage = 'Allergy created successfully!';
          this.errorMessage = '';
          console.log('Response:', response);
        },
        (error: any) => {
          this.errorMessage = 'Error creating allergy. Please try again.';
          this.successMessage = '';
          console.error('Error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all fields.';
      this.successMessage = '';
    }
  }
}
