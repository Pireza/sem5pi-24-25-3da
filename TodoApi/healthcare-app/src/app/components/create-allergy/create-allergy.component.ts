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
  code: string='';
  codeSystem: string='';
  patients: any[] = []; // Array to hold patient data

  constructor(private allergyService: AuthService) {}
  ngOnInit() {
    // Fetch all patients when the component is initialized
    this.allergyService.getAllPatientsInfo().subscribe(
      (response: any) => {
        this.patients = response; // Assuming the response contains the list of patients
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  createNewAllergy() {
    if (this.name && this.code && this.codeSystem && this.patientId !== null) {
      this.allergyService.createAllergies(this.name,this.code, this.codeSystem, this.description, this.patientId).subscribe(
        (response: any) => {
          
          console.log('Response:', response);
          alert('Allergy created successfully!');
          this.name = '';
          this.description = '';
          this.code = '';
          this.codeSystem = '';
          this.patientId = null;
        },
        (error: any) => {
          console.error('Error:', error);
          alert('There was an error while trying to add the allergy! That allergy may already be added to that patient.');
          this.name = '';
          this.description = '';
          this.code = '';
          this.codeSystem = '';
          this.patientId = null;
        }
      );
    } 
  }
}
