import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CreateOperationTypeRequest } from '../../Models/CreateOperationTypeRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-operation-type',
  templateUrl: './add-operation-type.component.html',
  styleUrls: ['./add-operation-type.component.css'],
  standalone: true,
  imports:[FormsModule, ReactiveFormsModule, CommonModule]
})
export class AddOperationTypeComponent implements OnInit {
  operationTypeForm: FormGroup;
  message: string | null = null;
  staffList: any[] = [];  // Store fetched staff list

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.operationTypeForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
      staff: this.fb.array([]) // FormArray for staff field
    });
  }

  ngOnInit(): void {
    this.fetchStaffList();
  }

  // Getter for the staff form array
  get staff(): FormArray {
    return this.operationTypeForm.get('staff') as FormArray;
  }

  // Add a new staff field (dropdown)
  addStaffField(): void {
    this.staff.push(this.fb.control(null, Validators.required)); // Add a control to the form array
  }

  // Remove a staff field by index
  removeStaffField(index: number): void {
    this.staff.removeAt(index);
  }

  // Fetch the list of staff (roles and specialization)
  fetchStaffList(): void {
    this.authService.getSpecializedStaff().subscribe({
      next: (response) => {
        this.staffList = response; // Store the staff list
      },
      error: (error) => {
        this.message = 'Unable to load staff list.';
        this.clearMessageAfterDelay();
      }
    });
  }

  // Submit the form
  onSubmit(): void {
    const staffIds = this.operationTypeForm.value.staff;

    const hasDuplicates = this.hasDuplicateStaff(staffIds);

    if (hasDuplicates) {
      this.message = 'All Staff IDs provided must be unique';
      this.clearMessageAfterDelay();
      return;
    }

    if (this.operationTypeForm.valid) {
      const typeData: CreateOperationTypeRequest = {
        name: this.operationTypeForm.value.name,
        duration: this.operationTypeForm.value.duration,
        staff: staffIds.map((staffId: number) => Number(staffId)) // Convert to numbers for backend
      };

      this.authService.addOperationType(typeData).subscribe({
        next: () => {
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

  // Function to clear message after 2 seconds
  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = null;
    }, 2000);
  }

  // Check for duplicate staff IDs
  private hasDuplicateStaff(staffIds: number[]): boolean {
    const uniqueStaffIds = new Set(staffIds);
    return uniqueStaffIds.size !== staffIds.length;
  }

}
