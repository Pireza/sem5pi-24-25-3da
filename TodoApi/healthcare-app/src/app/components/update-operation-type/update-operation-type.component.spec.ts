import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOperationTypeComponent } from './update-operation-type.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

class MockAuthService {
  updateOperationType = jasmine.createSpy('updateOperationType').and.returnValue(of({})); // Ensure this returns an observable
}

fdescribe('UpdateOperationTypeComponent', () => {
  let component: UpdateOperationTypeComponent;
  let fixture: ComponentFixture<UpdateOperationTypeComponent>;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, UpdateOperationTypeComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    });

    fixture = TestBed.createComponent(UpdateOperationTypeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    fixture.detectChanges();
  });

  // Test for component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test for form initialization
  it('should initialize the form with default values', () => {
    expect(component.updateForm).toBeDefined();
    expect(component.updateForm.get('id')?.value).toBe('');
    expect(component.updateForm.get('name')?.value).toBe('');
    expect(component.updateForm.get('duration')?.value).toBe('');
    expect(component.updateForm.get('staff')?.value).toBe('');
  });

  // Test for validation errors
  it('should show validation errors for required fields', () => {
    component.updateForm.markAllAsTouched(); // Simulate the user touching all fields
    fixture.detectChanges();

    const idError = component.updateForm.get('id')?.errors;
    expect(idError?.['required']).toBeTrue();

    const nameError = component.updateForm.get('name')?.errors;
    expect(nameError?.['required']).toBeTrue();

    const durationError = component.updateForm.get('duration')?.errors;
    expect(durationError?.['required']).toBeTrue();
  });

  // Test for valid duration format
  it('should validate the duration format', () => {
    component.updateForm.get('duration')?.setValue('25:00:00'); // Invalid time
    const invalidFormatError = component.updateForm.get('duration')?.errors;
    expect(invalidFormatError?.['invalidDuration']).toBeTrue();

    component.updateForm.get('duration')?.setValue('23:59:59'); // Valid time
    const validFormatError = component.updateForm.get('duration')?.errors;
    expect(validFormatError).toBeNull();
  });

  // Test for successful operation update
  it('should call AuthService to update operation type when valid', () => {
    const mockOperation = {
      id: 1,
      name: 'Updated Operation',
      duration: '01:30:00',
      staff: [1, 2],
    };

    // Set valid form values
    component.updateForm.setValue({
      id: '1',
      name: 'Updated Operation',
      duration: '01:30:00',
      staff: '1,2',
    });

    component.onSubmit();

    expect(authService.updateOperationType).toHaveBeenCalledWith(mockOperation);
    expect(component.message).toBe('Operation type updated successfully!');
    expect(component.messageType).toBe('success');
  });

  // Test for handling errors in operation update
  it('should handle errors when operation update fails', () => {
    const error = { status: 400, error: 'Bad request' };
    authService.updateOperationType.and.returnValue(throwError(() => error));

    // Set valid form values
    component.updateForm.setValue({
      id: '1',
      name: 'Invalid Operation',
      duration: '00:00:00',
      staff: '1',
    });

    component.onSubmit();

    expect(authService.updateOperationType).toHaveBeenCalled();
    expect(component.message).toBe('Bad request');
    expect(component.messageType).toBe('error');
  });

  // Test for unexpected errors
  it('should handle unexpected errors gracefully', () => {
    const error = { status: 500, error: 'Server error' };
    authService.updateOperationType.and.returnValue(throwError(() => error));

    component.updateForm.setValue({
      id: '1',
      name: 'Another Operation',
      duration: '01:00:00',
      staff: '1,2',
    });

    component.onSubmit();

    expect(authService.updateOperationType).toHaveBeenCalled();
    expect(component.message).toBe('An unexpected error occurred.');
    expect(component.messageType).toBe('error');
  });
});
