import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-medical-condition',
  templateUrl: './create-medical-condition.component.html',
  styleUrls: ['./create-medical-condition.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class CreateMedicalConditionComponent {
  code: string = '';
  codeSystem: string = '';
  designation: string = '';
  description: string = '';
  symptoms: string[] = [];
  symptomInput: string = '';

  constructor(private medicalConditionService: AuthService) {}

  addSymptom() {
    const trimmedSymptom = this.symptomInput.trim();
    if (!trimmedSymptom) {
      alert('Please enter a symptom before adding!');
      return;
    }
  
    if (this.symptoms.includes(trimmedSymptom)) {
      alert('This symptom is already in the list!');
      return;
    }
  
    this.symptoms.push(trimmedSymptom);
    this.symptomInput = '';
  }
  

  removeSymptom(index: number) {
    this.symptoms.splice(index, 1);
  }

  createNewMedicalCondition() {
    if (this.code && this.codeSystem && this.designation!==null) {
      this.medicalConditionService
        .createMedicalCondition(
          this.code,
          this.codeSystem,
          this.designation,
          this.description,
          this.symptoms
        )
        .subscribe(
          (response: any) => {
            console.log('Response:', response);
            alert('Medical condition created successfully!');
            this.resetForm();
          },
          (error: any) => {
            console.error('Error:', error);
            alert(
              'There was an error while trying to add the medical condition! The code of that condition may already have been added.'
            );
            this.resetForm();
          }
        );
    } else {
      alert('Please fill in all required fields!');
    }
  }

  private resetForm() {
    this.code = '';
    this.codeSystem = '';
    this.designation = '';
    this.description = '';
    this.symptoms = [];
    this.symptomInput = '';
  }
}
