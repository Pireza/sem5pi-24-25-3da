import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditStaffAdminComponent } from './edit-staff-admin.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AvailabilitySlot, Staff } from '../../Models/Staff';

describe('EditStaffAdminComponent', () => {
  let component: EditStaffAdminComponent;
  let fixture: ComponentFixture<EditStaffAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockStaffEmails = ['email1@example.com', 'email2@example.com'];
  const mockStaff: Staff = {
    username: 'username1',
    firstName: 'John',
    lastName: 'Doe',
    licenseNumber: '123456',
    phone: '1234567890',
    email: 'email1@example.com',
    role: 'Doctor',
    specialization: { specId: 1, specDescription: 'Cardiology' },
    availabilitySlots: [
      {
        id: 1,
        slot: 'Morning',
        startTime: '08:00',
        endTime: '12:00',
        date: '2024-01-01',
      },
    ],
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getStaffEmails',
      'getStaffByEmail',
      'updateStaffProfileAsAdmin',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [EditStaffAdminComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStaffAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch staff emails on initialization', () => {
    authServiceSpy.getStaffEmails.and.returnValue(of(mockStaffEmails));

    component.ngOnInit();

    expect(authServiceSpy.getStaffEmails).toHaveBeenCalled();
    expect(component.staffEmails).toEqual(mockStaffEmails);
  });

  it('should handle error while fetching staff emails', () => {
    const error = new Error('Failed to fetch staff emails');
    authServiceSpy.getStaffEmails.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(authServiceSpy.getStaffEmails).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching staff emails:', error);
  });

  it('should fetch staff details when email is changed', () => {
    authServiceSpy.getStaffByEmail.and.returnValue(of(mockStaff));

    component.onEmailChange('email1@example.com');

    expect(authServiceSpy.getStaffByEmail).toHaveBeenCalledWith('email1@example.com');
    expect(component.staffUpdateRequest.firstName).toEqual(mockStaff.firstName);
    expect(component.staffUpdateRequest.specializationId).toEqual(mockStaff.specialization.specId);
    expect(component.staffUpdateRequest.availabilitySlots).toEqual(mockStaff.availabilitySlots);
  });

  it('should handle error while fetching staff details', () => {
    const error = new Error('Failed to fetch staff details');
    authServiceSpy.getStaffByEmail.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.onEmailChange('email1@example.com');

    expect(authServiceSpy.getStaffByEmail).toHaveBeenCalledWith('email1@example.com');
    expect(console.error).toHaveBeenCalledWith('Error fetching staff details:', error);
  });

  it('should submit valid staff update request', () => {
    const successMessage = 'Staff updated successfully';
    spyOn(window, 'alert');
    authServiceSpy.updateStaffProfileAsAdmin.and.returnValue(of(undefined));

    component.staffUpdateRequest = {
      email: mockStaff.email,
      firstName: mockStaff.firstName,
      lastName: mockStaff.lastName,
      phone: mockStaff.phone,
      licenseNumber: mockStaff.licenseNumber,
      role: mockStaff.role,
      specializationId: mockStaff.specialization.specId,
      specializationDescription: mockStaff.specialization.specDescription,
      availabilitySlots: mockStaff.availabilitySlots,
    };

    component.onSubmit();

    expect(authServiceSpy.updateStaffProfileAsAdmin).toHaveBeenCalledWith(component.staffUpdateRequest);
    expect(window.alert).toHaveBeenCalledWith(successMessage);
  });

  it('should show error if required fields are missing during submission', () => {
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
      availabilitySlots: [],
    };

    component.onSubmit();

    expect(authServiceSpy.updateStaffProfileAsAdmin).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields!');
  });

  it('should handle error during staff update submission', () => {
    const error = new Error('Failed to update staff');
    spyOn(window, 'alert');
    authServiceSpy.updateStaffProfileAsAdmin.and.returnValue(throwError(error));

    component.staffUpdateRequest = {
      email: mockStaff.email,
      firstName: mockStaff.firstName,
      lastName: mockStaff.lastName,
      phone: mockStaff.phone,
      licenseNumber: mockStaff.licenseNumber,
      role: mockStaff.role,
      specializationId: mockStaff.specialization.specId,
      specializationDescription: mockStaff.specialization.specDescription,
      availabilitySlots: mockStaff.availabilitySlots,
    };

    component.onSubmit();

    expect(authServiceSpy.updateStaffProfileAsAdmin).toHaveBeenCalled();
  });

  it('should reset the form correctly', () => {
    component.staffUpdateRequest = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      licenseNumber: '1234',
      role: 'Nurse',
      specializationId: 2,
      specializationDescription: 'Surgery',
      availabilitySlots: [{ id: 1, slot: 'Morning', startTime: '08:00', endTime: '12:00', date: '2024-01-01' }],
    };

    component.resetForm();

    expect(component.staffUpdateRequest).toEqual({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      licenseNumber: '',
      role: '',
      specializationId: undefined,
      specializationDescription: '',
      availabilitySlots: [],
    });
  });
});
