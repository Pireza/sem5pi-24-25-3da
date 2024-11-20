import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditStaffAdminComponent } from './edit-staff-admin.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AvailabilitySlot, Staff } from '../../Models/Staff';

describe('EditStaffAdminComponent', () => {
  let component: EditStaffAdminComponent;
  let fixture: ComponentFixture<EditStaffAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getStaffEmails',
      'getStaffByEmail',
      'updateStaffProfileAsAdmin'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditStaffAdminComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditStaffAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch staff emails on initialization', () => {
    const mockEmails = ['test1@example.com', 'test2@example.com'];
    authServiceSpy.getStaffEmails.and.returnValue(of(mockEmails));

    component.ngOnInit();

    expect(authServiceSpy.getStaffEmails).toHaveBeenCalled();
    expect(component.staffEmails).toEqual(mockEmails);
  });

  it('should handle errors when fetching staff emails', () => {
    spyOn(console, 'error');
    authServiceSpy.getStaffEmails.and.returnValue(throwError(() => new Error('Test error')));

    component.ngOnInit();

    expect(authServiceSpy.getStaffEmails).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching staff emails:', jasmine.any(Error));
  });

  it('should update staffUpdateRequest when onEmailChange is called with valid data', () => {
    const mockStaff: Staff = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      licenseNumber: 'ABC123',
      role: 'Doctor',
      specialization: { specId: 1, specDescription: 'Cardiology' },
      availabilitySlots: [],
      username: ''
    };
    authServiceSpy.getStaffByEmail.and.returnValue(of(mockStaff));

    component.onEmailChange('test@example.com');

    expect(authServiceSpy.getStaffByEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.staffUpdateRequest).toEqual({
      email: '',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      licenseNumber: 'ABC123',
      role: 'Doctor',
      specializationId: 1,
      specializationDescription: 'Cardiology',
      availabilitySlots: []
    });
  });

  it('should handle errors when onEmailChange fails', () => {
    spyOn(console, 'error');
    authServiceSpy.getStaffByEmail.and.returnValue(throwError(() => new Error('Test error')));

    component.onEmailChange('test@example.com');

    expect(authServiceSpy.getStaffByEmail).toHaveBeenCalledWith('test@example.com');
    expect(console.error).toHaveBeenCalledWith('Error fetching staff details:', jasmine.any(Error));
  });

  it('should alert if required fields are missing on form submission', () => {
    spyOn(window, 'alert');
    component.staffUpdateRequest = {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      licenseNumber: '',
      role: '',
      specializationId: undefined,
      specializationDescription: '',
      availabilitySlots: []
    };

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields!');
    expect(authServiceSpy.updateStaffProfileAsAdmin).not.toHaveBeenCalled();
  });

  it('should call updateStaffProfileAsAdmin with correct data and reset form on success', () => {
    spyOn(window, 'alert');
    const mockRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      licenseNumber: 'ABC123',
      role: 'Doctor',
      specializationId: 1,
      specializationDescription: 'Cardiology',
      availabilitySlots: []
    };

    authServiceSpy.updateStaffProfileAsAdmin.and.returnValue(of(undefined));
    component.staffUpdateRequest = { ...mockRequest };

    component.onSubmit();

    expect(authServiceSpy.updateStaffProfileAsAdmin).toHaveBeenCalledWith(mockRequest);
    expect(window.alert).toHaveBeenCalledWith('Staff updated successfully');
    expect(component.staffUpdateRequest.email).toBe('');
  });

  it('should handle errors when updateStaffProfileAsAdmin fails', () => {
    spyOn(window, 'alert');
    const errorResponse = { error: { message: 'Test error' } };

    authServiceSpy.updateStaffProfileAsAdmin.and.returnValue(throwError(() => errorResponse));
    component.staffUpdateRequest.email = 'test@example.com';

    component.onSubmit();

    expect(authServiceSpy.updateStaffProfileAsAdmin).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error: Test error');
  });
});
