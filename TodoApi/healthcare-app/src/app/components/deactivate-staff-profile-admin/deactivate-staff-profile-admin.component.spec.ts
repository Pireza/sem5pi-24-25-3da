import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateStaffProfileAdminComponent } from './deactivate-staff-profile-admin.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('DeactivateStaffProfileAdminComponent', () => {
  let component: DeactivateStaffProfileAdminComponent;
  let fixture: ComponentFixture<DeactivateStaffProfileAdminComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['deactivateStaffByIdAsAdmin']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DeactivateStaffProfileAdminComponent, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateStaffProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if staff ID is not provided', () => {
    spyOn(window, 'alert');
    component.staffId = undefined;

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('Please provide a valid staff ID.');
    expect(authServiceMock.deactivateStaffByIdAsAdmin).not.toHaveBeenCalled();
  });

  it('should call AuthService with the correct ID on valid input', () => {
    const mockStaffId = 123;
    component.staffId = mockStaffId;
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(of(void 0)); // Simulate success

    component.deactivateStaffProfile();

    expect(authServiceMock.deactivateStaffByIdAsAdmin).toHaveBeenCalledWith(mockStaffId);
  });

  it('should navigate to admin dashboard on successful deactivation', () => {
    component.staffId = 123;
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(of(void 0));
    spyOn(window, 'alert');

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('Staff profile has been successfully deactivated.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should handle 200 status as success', () => {
    component.staffId = 123;
    const httpResponse = new HttpErrorResponse({ status: 200 });
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(throwError(httpResponse));
    spyOn(window, 'alert');

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('Staff profile has been successfully deactivated.');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should alert if staff member is not found (404 error)', () => {
    component.staffId = 999;
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(throwError({ status: 404 }));
    spyOn(window, 'alert');

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('Staff member not found.');
  });

  it('should alert if staff member is already deactivated (400 error)', () => {
    component.staffId = 123;
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(throwError({ status: 400 }));
    spyOn(window, 'alert');

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('Staff member is already deactivated.');
  });

  it('should alert with a generic error message on other errors', () => {
    component.staffId = 123;
    authServiceMock.deactivateStaffByIdAsAdmin.and.returnValue(throwError({ status: 500 }));
    spyOn(window, 'alert');

    component.deactivateStaffProfile();

    expect(window.alert).toHaveBeenCalledWith('An error occurred while deactivating the staff profile.');
  });
});
