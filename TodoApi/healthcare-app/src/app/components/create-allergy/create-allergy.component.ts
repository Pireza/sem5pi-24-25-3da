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

  constructor(private allergyService: AuthService) {}
 
  createNewAllergy() {
    if (this.name && this.code && this.codeSystem !== null) {
      this.allergyService.createAllergies(this.name,this.code, this.codeSystem, this.description).subscribe(
        (response: any) => {
          
          console.log('Response:', response);
          alert('Allergy created successfully!');
          this.name = '';
          this.description = '';
          this.code = '';
          this.codeSystem = '';
        },
        (error: any) => {
          console.error('Error:', error);
          alert('There was an error while trying to add the allergy! The code of that allergy may already been added.');
          this.name = '';
          this.description = '';
          this.code = '';
          this.codeSystem = '';
        }
      );
    } 
  }
}
