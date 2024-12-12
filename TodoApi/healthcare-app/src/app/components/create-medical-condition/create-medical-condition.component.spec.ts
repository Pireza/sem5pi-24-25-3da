import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMedicalConditionComponent } from './create-medical-condition.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

fdescribe('CreateMedicalConditionComponent', () => {
  let component: CreateMedicalConditionComponent;
  let fixture: ComponentFixture<CreateMedicalConditionComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['createMedicalCondition']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule,CreateMedicalConditionComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMedicalConditionComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a symptom to the list', () => {
    component.symptomInput = 'Fever';
    component.addSymptom();
    expect(component.symptoms).toContain('Fever');
    expect(component.symptomInput).toBe('');
  });

  it('should not add an empty symptom', () => {
    component.symptomInput = '';
    component.addSymptom();
    expect(component.symptoms.length).toBe(0);
  });

  it('should not add a duplicate symptom', () => {
    component.symptoms = ['Fever'];
    component.symptomInput = 'Fever';
    component.addSymptom();
    expect(component.symptoms.length).toBe(1);
  });

  it('should remove a symptom from the list', () => {
    component.symptoms = ['Fever', 'Cough'];
    component.removeSymptom(0);
    expect(component.symptoms).not.toContain('Fever');
    expect(component.symptoms.length).toBe(1);
  });

  it('should call createMedicalCondition and reset form on successful creation', () => {
    const mockResponse = { success: true };
    authServiceSpy.createMedicalCondition.and.returnValue(of(mockResponse));

    component.code = 'A001';
    component.codeSystem = 'ICD10';
    component.designation = 'Condition';
    component.description = 'Description';
    component.symptoms = ['Symptom1', 'Symptom2'];

    component.createNewMedicalCondition();

    expect(authServiceSpy.createMedicalCondition).toHaveBeenCalledWith(
      'A001',
      'ICD10',
      'Condition',
      'Description',
      ['Symptom1', 'Symptom2']
    );
    expect(component.code).toBe('');
    expect(component.codeSystem).toBe('');
    expect(component.designation).toBe('');
    expect(component.description).toBe('');
    expect(component.symptoms.length).toBe(0);
  });

  it('should display an error message and reset form on creation failure', () => {
    const mockError = { error: 'Duplicate code' };
    authServiceSpy.createMedicalCondition.and.returnValue(throwError(() => mockError));

    component.code = 'A001';
    component.codeSystem = 'ICD10';
    component.designation = 'Condition';
    component.description = 'Description';
    component.symptoms = ['Symptom1', 'Symptom2'];

    component.createNewMedicalCondition();

    expect(authServiceSpy.createMedicalCondition).toHaveBeenCalledWith(
      'A001',
      'ICD10',
      'Condition',
      'Description',
      ['Symptom1', 'Symptom2']
    );
    expect(component.code).toBe('');
    expect(component.codeSystem).toBe('');
    expect(component.designation).toBe('');
    expect(component.description).toBe('');
    expect(component.symptoms.length).toBe(0);
  });

  it('should not call createMedicalCondition if required fields are missing', () => {
    component.code = '';
    component.codeSystem = '';
    component.designation = '';

    component.createNewMedicalCondition();

    expect(authServiceSpy.createMedicalCondition).not.toHaveBeenCalled();
  });
});
