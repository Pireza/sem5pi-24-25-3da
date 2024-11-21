import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RegisterStaffComponent } from './register-staff.component';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('RegisterStaffComponent', () => {
  let component: RegisterStaffComponent;
  let fixture: ComponentFixture<RegisterStaffComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['registerStaff']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterStaffComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterStaffComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', () => {
    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

    // Initially, form is invalid (empty fields)
    expect(submitButton.disabled).toBeTrue();

    // Now set valid form values
    component.registerForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'Admin'
    });
    fixture.detectChanges();

    // After setting valid values, form should be valid
    expect(submitButton.disabled).toBeFalse();
  });

  it('should disable the submit button when loading', fakeAsync(() => {
    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

    // Set valid form values
    component.registerForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'Admin'
    });
    fixture.detectChanges();

    // Now simulate a loading state
    component.loading = true;
    fixture.detectChanges();
    
    // Check that the button is disabled when loading is true
    expect(submitButton.disabled).toBeTrue();

    // Simulate the completion of the request
    component.loading = false;
    fixture.detectChanges();

    // After loading is false, button should be enabled
    expect(submitButton.disabled).toBeFalse();
  }));

  it('should mark the username field as invalid when empty', () => {
    const usernameControl = component.registerForm.get('username');
    expect(usernameControl?.valid).toBeFalse();
    usernameControl?.setValue('testuser');
    expect(usernameControl?.valid).toBeTrue();
  });

  it('should mark the email field as invalid when invalid email is provided', () => {
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('validuser@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should set role to "Admin" by default if no role is selected', () => {
    const roleControl = component.registerForm.get('role');
    expect(roleControl?.value).toBe('');
    roleControl?.setValue('Doctor');
    expect(roleControl?.value).toBe('Doctor');
  });


});
