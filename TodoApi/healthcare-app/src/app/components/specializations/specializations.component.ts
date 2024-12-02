import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent {

  allSpecializations: any[] = [];
  isLoading: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllSpecializations().subscribe(
      (specs) => {
        this.allSpecializations = specs;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching specializations');
        this.isLoading = false;
      }
    );
  }



}
