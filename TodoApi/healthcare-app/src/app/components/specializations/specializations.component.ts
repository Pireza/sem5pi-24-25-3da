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

  onEdit(): void {
    console.log("edit");
  }

  onDelete(spec: any): void {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the specialization: ${spec.specDescription}?`
    );

    if (confirmDelete) {
      this.authService.deleteSpecialization(spec.specId).subscribe(
        () => {
          // Remove the deleted specialization from the list after successful API call
          this.allSpecializations = this.allSpecializations.filter(item => item.specId !== spec.specId);
          alert('Specialization deleted successfully!');
        },
        (error) => {
          console.error('Error deleting specialization:', error);
          alert('Failed to delete specialization. Please try again later.');
        }
      );
    }
  }




}
