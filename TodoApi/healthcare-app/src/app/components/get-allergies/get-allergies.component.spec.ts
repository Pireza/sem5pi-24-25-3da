import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAllergiesComponent } from './get-allergies.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';  // To mock the service response
import { Allergy } from '../../Models/Allergy';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('GetAllergiesComponent', () => {
  let component: GetAllergiesComponent;
  let fixture: ComponentFixture<GetAllergiesComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a mock instance of AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAllergies']);

    TestBed.configureTestingModule({
      imports: [GetAllergiesComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements (like FormsModule and CommonModule)
    });

    fixture = TestBed.createComponent(GetAllergiesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllergies on ngOnInit and populate the allergies list', () => {
    const mockAllergies: Allergy[] = [
      { name: 'Peanut', code: 'A01', codeSystem: 'ICD-10', description: 'Peanut allergy' },
      { name: 'Shellfish', code: 'A02', codeSystem: 'ICD-10', description: 'Shellfish allergy' }
    ];
    mockAuthService.getAllergies.and.returnValue(of({ data: mockAllergies }));

    component.ngOnInit();

    expect(mockAuthService.getAllergies).toHaveBeenCalled();
    expect(component.allergies.length).toBe(2);
    expect(component.allergies).toEqual(mockAllergies);
  });

  

  it('should handle errors from the service', () => {
    const error = new Error('Network error');
    mockAuthService.getAllergies.and.returnValue(throwError(() => error));

    spyOn(console, 'error');  // Spy on console.error to capture error logging

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching allergies:', error);
  });
});
