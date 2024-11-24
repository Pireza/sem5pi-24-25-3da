import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-operation-type',
  templateUrl: './update-operation-type.component.html',
  styleUrls: ['./update-operation-type.component.css'],
  standalone: true,
  imports: [
    CommonModule,        // For structural directives like *ngIf, *ngFor, and ngClass
    ReactiveFormsModule, // For reactive forms and formGroup bindings
  ],
})
export class UpdateOperationTypeComponent {
  updateForm: FormGroup; // Reactive form to capture user inputs
  isLoading: boolean = false; // Loading indicator for UI feedback
  message: string = ''; // Feedback message to show in the template
  messageType: 'success' | 'error' = 'success'; // Type of message for styling

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialize the form with fields and validation rules
    this.updateForm = this.fb.group({
      id: ['', [Validators.required]], // ID of the operation type
      name: ['', [Validators.required, Validators.maxLength(100)]], // Name field
      duration: ['', [Validators.required, this.validateDurationFormat]] // Duration in HH:mm:ss
    });
  }

  // Method to submit the form
  onSubmit() {
    if (this.updateForm.invalid) {
      this.showMessage('Please correct the errors in the form.', 'error');
      return;
    }

    this.isLoading = true; // Show loading spinner
    this.message = ''; // Clear previous messages

    const { id, name, duration } = this.updateForm.value;

    // Call the AuthService's updateOperationType method
    this.authService.updateOperationType(id, name, duration).subscribe({
      next: () => {
        this.showMessage('Operation type updated successfully!', 'success');
        this.updateForm.reset(); // Reset the form
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
        this.isLoading = false; // Hide loading spinner
      }
    });
  }

  // Method to show feedback messages
  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
  }

  // Custom validator for duration format (HH:mm:ss)
  private validateDurationFormat(control: { value: string }) {
    const durationRegex = /^([0-1]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/; // Regex for HH:mm:ss
    return durationRegex.test(control.value) ? null : { invalidDuration: true };
  }
}
