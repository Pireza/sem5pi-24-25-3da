// components/update-operation-type/update-operation-type.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UpdateOperationType } from '../../Models/UpdateOperationType';

@Component({
  selector: 'app-update-operation-type',
  templateUrl: './update-operation-type.component.html',
  styleUrls: ['./update-operation-type.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateOperationTypeComponent {
  updateForm: FormGroup;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialize the form
    this.updateForm = this.fb.group({
      id: ['', [Validators.required]], // Operation ID
      name: ['', [Validators.required, Validators.maxLength(100)]], // Operation Name
      duration: ['', [Validators.required, this.validateDurationFormat]], // Duration
      staff: [''], // Staff IDs (optional, comma-separated)
    });
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      this.showMessage('Please correct the errors in the form.', 'error');
      return;
    }

    this.isLoading = true;
    this.message = '';

    // Extract form values
    const { id, name, duration, staff } = this.updateForm.value;

    // Prepare the operation type object
    const operation: Partial<UpdateOperationType> = {
      id: Number(id), // Ensure ID is a number
      name: name || undefined,
      duration: duration || undefined,
      staff: staff ? staff.split(',').map((s: string) => parseInt(s.trim(), 10)) : undefined, // Parse staff into an array of numbers
    };

    // Call the update service
    this.authService.updateOperationType(operation).subscribe({
      next: () => {
        this.showMessage('Operation type updated successfully!', 'success');
        this.updateForm.reset();
      },
      error: (error) => {
        if (error.status === 400) {
          this.showMessage(error.error || 'Bad request', 'error');
        } else if (error.status === 404) {
          this.showMessage('Operation type not found.', 'error');
        } else {
          this.showMessage('An unexpected error occurred.', 'error');
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
  }

  private validateDurationFormat(control: { value: string }) {
    const durationRegex = /^([0-1]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/;
    return durationRegex.test(control.value) ? null : { invalidDuration: true };
  }
}
