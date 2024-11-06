import { Component, OnInit } from '@angular/core';
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
      staff: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch the staff list on component load
    this.fetchStaffList();
  }

  // Getter for the staff form array
  get staff(): FormArray {
    return this.operationTypeForm.get('staff') as FormArray;
  }

  // Add a new staff ID field
  addStaffField(): void {
    this.staff.push(this.fb.control('', Validators.required));
  }

  // Remove a staff ID field by index
  removeStaffField(index: number): void {
    this.staff.removeAt(index);
  }

  // Method to fetch the staff list
  fetchStaffList(): void {
    this.authService.getSpecializedStaff().subscribe({
      next: (response) => {
        this.staffList = response; // Save the fetched staff list
      },
      error: (error) => {
        this.message = 'Unable to load staff list.';
        this.clearMessageAfterDelay();
      }
    });
  }

  // Open a new tab with the staff list
  openStaffListTab(): void {
  // Open a new tab and write HTML to display the specialized staff list
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
      <head>
        <title>Specializations List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Specializations List</h2>
        <table>
          <tr><th>ID</th><th>Role</th><th>Specialization</th></tr>
          ${this.staffList.map(staff => `
            <tr>
              <td>${staff.id}</td>
              <td>${staff.role}</td>
              <td>${staff.specialization || 'N/A'}</td> <!-- Updated to show spec description -->
            </tr>`).join('')}
        </table>
      </body>
      </html>
    `);
    newWindow.document.close();
  }
}

  // Submit form
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
        staff: staffIds.map((staffId: string) => Number(staffId)) // Convert each ID to a number
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
  private hasDuplicateStaff(staffIds: string[]): boolean {
    const uniqueStaffIds = new Set(staffIds);
    return uniqueStaffIds.size !== staffIds.length;
  }
}
