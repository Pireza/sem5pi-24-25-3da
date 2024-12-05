import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // Adjust the path if needed
import { MedicalCondition } from '../../Models/MedicalCondition'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-get-all-medical-condition',
  templateUrl: './get-all-medical-condition.component.html',
  styleUrls: ['./get-all-medical-condition.component.css'],
  imports:[FormsModule,CommonModule],
  standalone: true
})
export class GetAllMedicalConditionComponent implements OnInit {
  medicalConditions: MedicalCondition[] = []; // To store the list of medical conditions

  constructor(private medicalConditionService: AuthService) {}

  ngOnInit(): void {
    this.medicalConditionService.getMedicalConditions().subscribe(
      (response) => {
        console.log('Medical Conditions data:', response); // Log the full response
        if (response && Array.isArray(response.data)) {
          this.medicalConditions = response.data; // Extract the medical conditions array from the data property
        } else {
          console.error('Medical Conditions data is not in expected format:', response);
        }
      },
      (error) => {
        console.error('Error fetching medical conditions:', error);
      }
    );
  }
}
