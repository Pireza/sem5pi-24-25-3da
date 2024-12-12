import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAllMedicalConditionComponent } from './get-all-medical-condition.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';  // To mock the service response
import { MedicalCondition } from '../../Models/MedicalCondition';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('GetAllMedicalConditionComponent', () => {
  let component: GetAllMedicalConditionComponent;
  let fixture: ComponentFixture<GetAllMedicalConditionComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a mock instance of AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getMedicalConditions']);

    TestBed.configureTestingModule({
      imports: [GetAllMedicalConditionComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements (like FormsModule and CommonModule)
    });

    fixture = TestBed.createComponent(GetAllMedicalConditionComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMedicalConditions on ngOnInit and populate the medicalConditions list', () => {
    const mockMedicalConditions: MedicalCondition[] = [
      { 
        code: 'H01', 
        codeSystem: 'ICD-10', 
        designation: 'Hypertension', 
        description: 'High blood pressure', 
        commonSymptoms: ['Headaches', 'Dizziness']
      },
      { 
        code: 'D01', 
        codeSystem: 'ICD-10', 
        designation: 'Diabetes', 
        description: 'Blood sugar disorder', 
        commonSymptoms: ['Fatigue', 'Frequent urination']
      }
    ];
    mockAuthService.getMedicalConditions.and.returnValue(of({ data: mockMedicalConditions }));

    component.ngOnInit();

    expect(mockAuthService.getMedicalConditions).toHaveBeenCalled();
    expect(component.medicalConditions.length).toBe(2);
    expect(component.medicalConditions).toEqual(mockMedicalConditions);
  });

  

  it('should handle errors from the service', () => {
    const error = new Error('Network error');
    mockAuthService.getMedicalConditions.and.returnValue(throwError(() => error));

    spyOn(console, 'error');  // Spy on console.error to capture error logging

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching medical conditions:', error);
  });
});
