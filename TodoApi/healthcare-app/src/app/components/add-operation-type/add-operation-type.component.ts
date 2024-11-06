import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CreateOperationTypeRequest } from '../../Models/CreateOperationTypeRequest';

@Component({
  selector: 'app-add-operation-type',
  standalone: true,
  templateUrl: './add-operation-type.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./add-operation-type.component.css']
})

export class AddOperationTypeComponent {
  operationTypeForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.operationTypeForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
      staff: this.fb.array([])
    });
  }

  get staff(): FormArray {
    return this.operationTypeForm.get('staff') as FormArray;
  }

  addStaffField(): void {
    this.staff.push(this.fb.control('', Validators.required));
  }

  removeStaffField(index: number): void {
    this.staff.removeAt(index);
  }

  onSubmit(): void {

    const staffIds = this.operationTypeForm.value.staff;
    const hasDuplicates = this.hasDuplicateStaff(staffIds);

    if (hasDuplicates) {
      this.message = 'All Staff IDs provided must be unique';
      this.clearMessageAfterDelay();
      return;  // Stop form submission if duplicates are found
    }

    if (this.operationTypeForm.valid) {
      const typeData: CreateOperationTypeRequest = {
        name: this.operationTypeForm.value.name,
        duration: this.operationTypeForm.value.duration,
        staff: this.operationTypeForm.value.staff.map((staffId: string) => Number(staffId)) // Convert each ID to a number
      };

      this.authService.addOperationType(typeData).subscribe({
        next: (response) => {
          this.message = 'Operation type created successfully!';
          this.operationTypeForm.reset();
          this.staff.clear();
          this.clearMessageAfterDelay();
        },
        error: (error) => {
          this.message = error.error || 'An error occurred while creating the operation type.';
          this.clearMessageAfterDelay();
        }
      });
    } else {
      this.message = 'Please fill in all required fields.';
      this.clearMessageAfterDelay();
    }
  }

  // Function to remove message after 2 seconds
  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = null;
    }, 2000);
  }

  private hasDuplicateStaff(staffIds: string[]): boolean {
    const uniqueStaffIds = new Set(staffIds);
    return uniqueStaffIds.size !== staffIds.length;  // Returns true if duplicates are found
  }
}
