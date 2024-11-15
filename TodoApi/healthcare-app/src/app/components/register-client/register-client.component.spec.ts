import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterClientComponent } from './register-client.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

class MockAuthService {
  registerPatient = jasmine.createSpy('registerPatient').and.returnValue(of({}));
  isAuthenticated = false;
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

fdescribe('RegisterClientComponent', () => {
  let component: RegisterClientComponent;
  let fixture: ComponentFixture<RegisterClientComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RegisterClientComponent], 
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterClientComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  // Test Initialization
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test addCondition method
  describe('addCondition', () => {
    it('should add a new condition to the medicalConditions array', () => {
      component.newCondition = 'Asthma';
      component.addCondition();
      expect(component.client.medicalConditions).toContain('Asthma');
      expect(component.newCondition).toBe('');
    });

    it('should not add an empty condition', () => {
      component.newCondition = '   ';
      component.addCondition();
      expect(component.client.medicalConditions.length).toBe(0);
    });
  });

  // Test removeCondition method
  describe('removeCondition', () => {
    it('should remove a condition from the medicalConditions array', () => {
      component.client.medicalConditions = ['Asthma', 'Diabetes'];
      component.removeCondition(0);
      expect(component.client.medicalConditions.length).toBe(1);
      expect(component.client.medicalConditions).not.toContain('Asthma');
    });
  });

  // Test formatDateToDDMMYYYY method
  describe('formatDateToDDMMYYYY', () => {
    it('should correctly format a Date object to dd/MM/yyyy', () => {
      const date = new Date('2024-11-15');
      const formattedDate = component.formatDateToDDMMYYYY(date);
      expect(formattedDate).toBe('15/11/2024');
    });
  });

  // Test onSubmit method
  describe('onSubmit', () => {
    beforeEach(() => {
      // Initialize a default client object
      component.client = {
        username: 'JohnDoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        birthday: '2000-01-01',
        gender: 'Male',
        medicalNumber: 12345,
        phone: '1234567890',
        emergencyContact: '9876543210',
        medicalConditions: ['Asthma']
      };
    });

    it('should call registerPatient and navigate on success', () => {
      authService.registerPatient.and.returnValue(of({}));

      component.onSubmit();

      expect(authService.registerPatient).toHaveBeenCalledWith(component.client);
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('should set an error message if user already exists', () => {
      component.client.email = 'existing@example.com';

      authService.registerPatient.and.returnValue(throwError({
        status: 400,
        error: 'User already exists in the system'
      }));

      component.onSubmit();

      expect(component.errorMessage).toBe('A user with this email or username already exists. Please use a different email or username.');
    });

    it('should handle unknown errors gracefully', () => {
      authService.registerPatient.and.returnValue(throwError({
        status: 500,
        error: 'Some server error'
      }));

      component.onSubmit();

      expect(component.errorMessage).toBe('An unexpected error occurred. Please try again later.');
    });
  });

  // Test goBack method
  describe('goBack', () => {
    it('should navigate to /auth', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });
});
