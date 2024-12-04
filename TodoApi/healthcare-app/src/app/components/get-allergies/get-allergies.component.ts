import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // Adjust the path if needed
import { Allergy } from '../../Models/Allergy'; // Adjust the path if needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-get-allergies',
  templateUrl: './get-allergies.component.html',
  styleUrls: ['./get-allergies.component.css'],
  imports:[FormsModule,CommonModule],
  standalone: true
})
export class GetAllergiesComponent implements OnInit {
  allergies: Allergy[] = [];  // To store the list of allergies

  constructor(private allergyService: AuthService) { }

  ngOnInit(): void {
    this.allergyService.getAllergies().subscribe(
      (response) => {
        console.log('Allergies data:', response); // Log the full response
        if (response && Array.isArray(response.data)) {
          this.allergies = response.data; // Extract the allergies array from the data property
        } else {
          console.error('Allergies data is not in expected format:', response);
        }
      },
      (error) => {
        console.error('Error fetching allergies:', error);
      }
    );
  }
  
  
  
}
