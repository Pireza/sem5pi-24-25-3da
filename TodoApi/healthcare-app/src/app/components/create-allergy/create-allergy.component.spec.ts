import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAllergyComponent } from './create-allergy.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

fdescribe('CreateAllergyComponent', () => {
  let component: CreateAllergyComponent;
  let fixture: ComponentFixture<CreateAllergyComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['createAllergies']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule,CreateAllergyComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAllergyComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createAllergies and reset fields on successful allergy creation', () => {
    const mockResponse = { success: true };
    authServiceSpy.createAllergies.and.returnValue(of(mockResponse));

    component.name = 'Pollen Allergy';
    component.description = 'Seasonal allergy';
    component.code = 'A123';
    component.codeSystem = 'ICD10';

    component.createNewAllergy();

    expect(authServiceSpy.createAllergies).toHaveBeenCalledWith(
      'Pollen Allergy',
      'A123',
      'ICD10',
      'Seasonal allergy'
    );
    expect(component.name).toBe('');
    expect(component.description).toBe('');
    expect(component.code).toBe('');
    expect(component.codeSystem).toBe('');
  });

  it('should display an error message and reset fields on allergy creation failure', () => {
    const mockError = { error: 'Duplicate code' };
    authServiceSpy.createAllergies.and.returnValue(throwError(() => mockError));

    component.name = 'Pollen Allergy';
    component.description = 'Seasonal allergy';
    component.code = 'A123';
    component.codeSystem = 'ICD10';

    component.createNewAllergy();

    expect(authServiceSpy.createAllergies).toHaveBeenCalledWith(
      'Pollen Allergy',
      'A123',
      'ICD10',
      'Seasonal allergy'
    );
    expect(component.name).toBe('');
    expect(component.description).toBe('');
    expect(component.code).toBe('');
    expect(component.codeSystem).toBe('');
  });

  it('should not call createAllergies if required fields are missing', () => {
    component.name = '';
    component.code = '';
    component.codeSystem = '';

    component.createNewAllergy();

    expect(authServiceSpy.createAllergies).not.toHaveBeenCalled();
  });
});
