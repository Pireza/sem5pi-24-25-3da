import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePatientAdminComponent } from './create-patient-admin.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

fdescribe('CreatePatientAdminComponent', () => {
  let component: CreatePatientAdminComponent;
  let fixture: ComponentFixture<CreatePatientAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['createPatientAsAdmin']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreatePatientAdminComponent], // Import the standalone component
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePatientAdminComponent);
    component = fixture.componentInstance;
  });

  it('should format the birthday and call createPatientAsAdmin', () => {
    // Set values directly on the client object
    component.client = {
      username: 'johnDoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthday: '2000-01-01',
      gender: 'Male',
      medicalNumber: 123456,
      phone: '1234567890',
      emergencyContact: '9876543210',
      medicalConditions: []  // Ensure medicalConditions is an empty array
    };

    // Mock the service response
    authServiceSpy.createPatientAsAdmin.and.returnValue(of({}));

    component.onSubmit();

    // Check that the method was called with the correct data
    expect(authServiceSpy.createPatientAsAdmin).toHaveBeenCalledWith({
      username: 'johnDoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthday: '01/01/2000', // Check that the date is properly formatted
      gender: 'Male',
      medicalNumber: 123456,
      phone: '1234567890',
      emergencyContact: '9876543210',
      medicalConditions: []  // Check that medicalConditions is included as an empty array
    });
  });
});
