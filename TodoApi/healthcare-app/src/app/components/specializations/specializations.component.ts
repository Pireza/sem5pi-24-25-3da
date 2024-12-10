import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';

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
  filterForm: FormGroup;
  isEditing: boolean = false; // To toggle edit form
  isAdding: boolean = false; // To toggle add form
  isFiltering: boolean = false;


  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.specializationForm = this.fb.group({
      specDescription: ['', Validators.required],
      specLongDescription: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      specCode: [''],
      specDescription: [''],
      specLongDescription: ['']
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
    this.isFiltering = false;
  }

  onAdd(): void {
    this.specializationForm.reset();
    this.isAdding = true;
    this.isEditing = false;
    this.isFiltering = false;
  }

  onSearch(): void {
    this.filterForm.reset();
    this.isAdding = false;
    this.isEditing = false;
    this.isFiltering = true;
  }

  onFilter(): void {

    this.isLoading = true;
    const formValue = this.filterForm.value;
    this.authService.filterSpecializations(formValue).subscribe(
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

  onSave(): void {
    const formValue = this.specializationForm.value;

    if (this.isEditing) {
      if (this.selectedSpecialization) {

        const index = this.allSpecializations.findIndex(spec => spec.specDescription === this.selectedSpecialization.specDescription);
        const updatedSpecialization = {
          ...this.selectedSpecialization,
          specDescription: formValue.specDescription,
          specLongDescription: formValue.specLongDescription
        };

        this.authService.updateSpecialization(this.selectedSpecialization.specId, updatedSpecialization).subscribe(
          (updatedSpec) => {

            this.allSpecializations.splice(index, 1);
            this.allSpecializations.push(updatedSpec);

            alert('Specialization updated successfully!');
            this.onCancel();
          },
          (error) => {
            console.error('Error updating specialization:', error);
            alert('Failed to update specialization. Please try again later.');
          }
        );
      }
    } else if (this.isAdding) {
      const newSpecialization = {
        specDescription: formValue.specDescription,
        specLongDescription: formValue.specLongDescription
      };

      this.authService.createSpecialization(newSpecialization).subscribe(
        (addedSpec) => {
          this.allSpecializations.push(addedSpec);
          alert('Specialization added successfully!');
          this.onCancel();
        },
        (error) => {
          console.error('Error adding specialization:', error);
          alert('Failed to add specialization. Please try again later.');
        }
      );
    }
  }


  onCancel(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.isFiltering = false;

  }

  onCancelFilter(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.isFiltering = false;

    this.isLoading = true;
    
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
