import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateStaffAdminComponent } from './create-staff-admin.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AvailabilitySlot } from '../../Models/Staff';

fdescribe('CreateStaffAdminComponent', () => {
  let component: CreateStaffAdminComponent;
  let fixture: ComponentFixture<CreateStaffAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['createStaffAsAdmin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateStaffAdminComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStaffAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing on form submission', () => {
    spyOn(window, 'alert');
    component.staffRequest = {
      username: '',
      firstName: '',
      lastName: '',
      licenseNumber: '',
      phone: '',
      email: '',
      role: '',
      specialization: { specId: 0, specDescription: '' },
      availabilitySlots: []
    };

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields!');
    expect(authServiceSpy.createStaffAsAdmin).not.toHaveBeenCalled();
  });

  it('should call createStaffAsAdmin with the correct data and navigate on success', () => {
    const staffData = {
      username: 'johnDoe',
      firstName: 'John',
      lastName: 'Doe',
      licenseNumber: '123456',
      phone: '1234567890',
      email: 'john.doe@example.com',
      role: 'Doctor',
      specialization: { specId: 1, specDescription: 'Cardiology' },
      availabilitySlots: [
        { id: 1, slot: 'Morning', startTime: '09:00', endTime: '17:00', date: '2024-11-20' },
        { id: 2, slot: 'Afternoon', startTime: '13:00', endTime: '18:00', date: '2024-11-22' }
      ] as AvailabilitySlot[]
    };

    authServiceSpy.createStaffAsAdmin.and.returnValue(of(undefined));
    component.staffRequest = staffData;

    component.onSubmit();

    expect(authServiceSpy.createStaffAsAdmin).toHaveBeenCalledWith(staffData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-ui']);
  });

  it('should handle errors when createStaffAsAdmin fails', () => {
    spyOn(window, 'alert');

    const staffData = {
      username: 'johnDoe',
      firstName: 'John',
      lastName: 'Doe',
      licenseNumber: '123456',
      phone: '1234567890',
      email: 'john.doe@example.com',
      role: 'Doctor',
      specialization: { specId: 1, specDescription: 'Cardiology' },
      availabilitySlots: [
        { id: 1, slot: 'Morning', startTime: '09:00', endTime: '17:00', date: '2024-11-20' },
        { id: 2, slot: 'Afternoon', startTime: '13:00', endTime: '18:00', date: '2024-11-22' }
      ] as AvailabilitySlot[]
    };

    const errorResponse = { error: { message: 'Test error' } };

    authServiceSpy.createStaffAsAdmin.and.returnValue(throwError(() => errorResponse));
    component.staffRequest = staffData;

    component.onSubmit();

    expect(authServiceSpy.createStaffAsAdmin).toHaveBeenCalledWith(staffData);
    expect(window.alert).toHaveBeenCalledWith('Error: Test error');
  });
});
