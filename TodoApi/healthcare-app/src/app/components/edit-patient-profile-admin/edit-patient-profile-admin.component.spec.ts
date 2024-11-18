import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPatientProfileAdminComponent } from './edit-patient-profile-admin.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

fdescribe('EditPatientProfileAdminComponent', () => {
  let component: EditPatientProfileAdminComponent;
  let fixture: ComponentFixture<EditPatientProfileAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getPatientEmails', 'getPatientByEmail', 'updatePatientAsAdmin']);

    await TestBed.configureTestingModule({
      imports: [EditPatientProfileAdminComponent], // Import the standalone component
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPatientProfileAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available emails and set the patient data', () => {
    const availableEmails = ['john.doe@example.com', 'jane.doe@example.com'];
    authServiceSpy.getPatientEmails.and.returnValue(of(availableEmails));

    component.loadAvailableEmails();

    expect(component.availableEmails).toEqual(availableEmails);
    expect(authServiceSpy.getPatientEmails).toHaveBeenCalled();
  });

  it('should load patient data based on email', () => {
    const email = 'john.doe@example.com';
    const patientData = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      emergencyContact: '9876543210',
      medicalConditions: []
    };

    authServiceSpy.getPatientByEmail.and.returnValue(of(patientData));

    component.loadPatientData(email);

    expect(component.patient).toEqual(patientData);
    expect(authServiceSpy.getPatientByEmail).toHaveBeenCalledWith(email);
  });

  it('should submit and update the patient data', () => {
    const updatedPatient = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      emergencyContact: '9876543210',
      medicalConditions: ['Condition1']
    };

    authServiceSpy.updatePatientAsAdmin.and.returnValue(of(undefined));


    component.patient = updatedPatient; // Set patient data

    component.onSubmit();

    expect(authServiceSpy.updatePatientAsAdmin).toHaveBeenCalledWith(updatedPatient);
    expect(component.patient.email).toBe('');
    expect(component.patient.firstName).toBe('');
    expect(component.patient.lastName).toBe('');
    expect(component.patient.phone).toBe('');
    expect(component.patient.emergencyContact).toBe('');
    expect(component.patient.medicalConditions).toEqual([]);
  });

  it('should add a new condition', () => {
    const condition = 'New Medical Condition';
    component.newCondition = condition;

    component.addCondition();

    expect(component.patient.medicalConditions).toContain(condition);
    expect(component.newCondition).toBe('');
  });

  it('should remove a condition', () => {
    const condition = 'Old Medical Condition';
    component.patient.medicalConditions.push(condition);

    component.removeCondition(0);

    expect(component.patient.medicalConditions).not.toContain(condition);
  });
});
