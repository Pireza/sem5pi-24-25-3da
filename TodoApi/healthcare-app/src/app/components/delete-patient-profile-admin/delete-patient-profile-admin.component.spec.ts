import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletePatientProfileAdminComponent } from './delete-patient-profile-admin.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

fdescribe('DeletePatientProfileAdminComponent', () => {
  let component: DeletePatientProfileAdminComponent;
  let fixture: ComponentFixture<DeletePatientProfileAdminComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['deletePatientByEmailAsAdmin']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DeletePatientProfileAdminComponent, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePatientProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if patient email is not provided', () => {
    spyOn(window, 'alert');
    component.patientEmail = undefined;

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith('Please provide a patient email.');
    expect(authServiceMock.deletePatientByEmailAsAdmin).not.toHaveBeenCalled();
  });

  it('should call AuthService with the correct email on valid input', () => {
    const mockEmail = 'test@example.com';
    component.patientEmail = mockEmail;
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(of(void 0)); // Explicitly return Observable<void>

    component.deactivatePatientProfile();

    expect(authServiceMock.deletePatientByEmailAsAdmin).toHaveBeenCalledWith(mockEmail);
  });

  it('should navigate to admin dashboard on successful deletion', () => {
    component.patientEmail = 'test@example.com';
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(of(void 0));
    spyOn(window, 'alert');

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith('Patient Profile marked for deletion successfully.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should alert if patient is not found (404 error)', () => {
    component.patientEmail = 'nonexistent@example.com';
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(throwError({ status: 404 }));
    spyOn(window, 'alert');

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith('Patient not found. Please check the email address and try again.');
  });

  it('should alert if user lacks permissions (403 error)', () => {
    component.patientEmail = 'restricted@example.com';
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(throwError({ status: 403 }));
    spyOn(window, 'alert');

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith('You do not have the necessary permissions to deactivate this profile.');
  });

  it('should alert if patient is already marked for deletion (400 or 409 error)', () => {
    component.patientEmail = 'pending@example.com';
    const mockError = { status: 409, error: { message: 'Patient is already marked for deletion.' } };
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(throwError(mockError));
    spyOn(window, 'alert');

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith(mockError.error.message);
  });

  it('should alert with a generic message on an unexpected error', () => {
    component.patientEmail = 'unknown@example.com';
    authServiceMock.deletePatientByEmailAsAdmin.and.returnValue(throwError({ status: 500 }));
    spyOn(window, 'alert');

    component.deactivatePatientProfile();

    expect(window.alert).toHaveBeenCalledWith('Failed to deactivate patient profile. Please try again later.');
  });
});
