import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent {

  allSpecializations: any[] = [];
  isLoading: boolean = true;
  selectedSpecialization: any = null; // To store selected specialization
  specializationForm: FormGroup;
  isEditing: boolean = false; // To toggle edit form
  isAdding: boolean = false; // To toggle add form



  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.specializationForm = this.fb.group({
      specDescription: ['', Validators.required],
      specLongDescription: ['', Validators.required]
    });
  }

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

  onEdit(spec: any): void {
    this.selectedSpecialization = spec;
    this.specializationForm.setValue({
      specDescription: spec.specDescription,
      specLongDescription: spec.specLongDescription
    });
    this.isEditing = true;
    this.isAdding = false;
  }

  onAdd(): void {
    this.specializationForm.reset();
    this.isAdding = true;
    this.isEditing = false;
  }

  onSave(): void {
    if (this.isEditing) {
      console.log('Saving edited specialization:', this.specializationForm.value);
    } else if (this.isAdding) {
      console.log("lmao");
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.isAdding = false;
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
