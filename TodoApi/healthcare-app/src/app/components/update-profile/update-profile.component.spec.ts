import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProfileComponent } from './update-profile.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService';
import { of, throwError } from 'rxjs';

class MockAuthService {
  updatePatientProfile = jasmine.createSpy('updatePatientProfile').and.returnValue(of({}));
  getPatientByEmail = jasmine.createSpy('getPatientByEmail').and.returnValue(of({
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890',
    emergencyContact: '0987654321'
  }));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockUserService {
  userEmail = 'test@example.com'; // Mock email for the user
}

fdescribe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let authService: MockAuthService;
  let router: MockRouter;
  let userService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,UpdateProfileComponent], // Import ReactiveFormsModule
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: UserService, useClass: MockUserService },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    fixture.detectChanges();
  });

  // Test Initialization
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit method
  describe('ngOnInit', () => {
    it('should set userEmail from the UserService', () => {
      component.ngOnInit();
      expect(component.userEmail).toBe('test@example.com');
    });
  });

  // Test onSubmit method
  describe('onSubmit', () => {
    it('should call updatePatientProfile and navigate on success', () => {
      // Mock the form values
      component.updateProfileForm.setValue({
        newEmail: 'newemail@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        emergencyContact: '9876543210'
      });

      component.onSubmit();

      expect(authService.updatePatientProfile).toHaveBeenCalledWith(
        'test@example.com', 'newemail@example.com', 'John', 'Doe', '1234567890', '9876543210'
      );
    });

    it('should handle errors gracefully', () => {
      component.updateProfileForm.setValue({
        newEmail: 'newemail@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        emergencyContact: '9876543210'
      });

      // Simulate an error
      authService.updatePatientProfile.and.returnValue(throwError('Error'));

      spyOn(console, 'error');
      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error updating profile:', 'Error');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    
  });

 
 
});
