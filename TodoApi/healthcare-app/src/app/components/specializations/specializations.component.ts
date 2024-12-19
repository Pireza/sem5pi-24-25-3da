import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';


/**
 * Component for managing specializations.
 * 
 * @component
 * @selector app-specializations
 * @templateUrl ./specializations.component.html
 * @styleUrl ./specializations.component.css
 */

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent {
  /**
     * List of all specializations.
     */
  allSpecializations: any[] = [];
  /**
   * Indicates if the data is loading.
   */
  isLoading: boolean = true;
  /**
   * Stores the selected specialization for editing.
   */
  selectedSpecialization: any = null; // To store selected specialization
  /**
   * Form group for specialization details.
   */
  specializationForm: FormGroup;
  /**
   * Form group for filtering specializations.
   */
  filterForm: FormGroup;
  /**
  * Indicates if the edit form is active.
  */
  isEditing: boolean = false; // To toggle edit form
  /**
  * Indicates if the add form is active.
  */
  isAdding: boolean = false; // To toggle add form
  /**
   * Indicates if the filter form is active.
   */
  isFiltering: boolean = false;

  /**
    * Constructor to initialize forms and inject services.
    * 
    * @param authService - Service for handling specialization data.
    * @param fb - FormBuilder for creating form groups.
    */
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

  /**
     * Lifecycle hook that is called after data-bound properties are initialized.
     * Fetches all specializations.
     */

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

  /**
     * Handles the edit action for a specialization.
     * 
     * @param spec - The specialization to be edited.
     */

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

  /**
     * Handles the add action to create a new specialization.
     */

  onAdd(): void {
    this.specializationForm.reset();
    this.isAdding = true;
    this.isEditing = false;
    this.isFiltering = false;
  }

  /**
     * Handles the search action to filter specializations.
     */

  onSearch(): void {
    this.filterForm.reset();
    this.isAdding = false;
    this.isEditing = false;
    this.isFiltering = true;
  }

  /**
     * Filters the specializations based on the filter form values.
     */

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

  /**
     * Saves the specialization, either by updating an existing one or adding a new one.
     */

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

  /**
     * Cancels the current action (edit, add, or filter).
     */

  onCancel(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.isFiltering = false;

  }

  /**
    * Cancels the filter action and reloads all specializations.
    */

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

  /**
     * Deletes a specialization.
     * 
     * @param spec - The specialization to be deleted.
     */

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
