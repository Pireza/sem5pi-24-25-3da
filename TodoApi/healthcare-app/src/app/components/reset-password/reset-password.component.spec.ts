import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';  // Used for simulating successful and error responses
import { Router } from '@angular/router';

fdescribe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a mock AuthService
    authService = jasmine.createSpyObj('AuthService', ['resetPassword']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetPassword method of AuthService on form submit', () => {
    // Arrange
    component.email = 'test@example.com';
    const resetPasswordSpy = authService.resetPassword.and.returnValue(of({ message: 'Password reset email sent successfully' }));
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(resetPasswordSpy).toHaveBeenCalledWith('test@example.com');
  });

  it('should display success message when resetPassword is successful', () => {
    // Arrange
    const successMessage = 'Password reset email sent successfully';
    authService.resetPassword.and.returnValue(of({ message: successMessage }));

    // Act
    component.onSubmit();
    fixture.detectChanges();

    // Assert
    expect(component.isSuccess).toBeTrue();
    expect(component.message).toBe(successMessage);
  });

  it('should display error message when resetPassword fails', () => {
    // Arrange
    const errorMessage = 'Failed to send password reset email';
    authService.resetPassword.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));

    // Act
    component.onSubmit();
    fixture.detectChanges();

    // Assert
    expect(component.isSuccess).toBeFalse();
    expect(component.message).toBe(errorMessage);
  });

  it('should close the message when close button is clicked', () => {
    // Arrange
    component.message = 'Some message';
    fixture.detectChanges();
    const closeButton = fixture.debugElement.nativeElement.querySelector('.close-btn');

    // Act
    closeButton.click();
    fixture.detectChanges();

    // Assert
    expect(component.message).toBe('');
  });


  it('should enable the submit button when email is provided', () => {
    // Arrange
    const submitButton = fixture.debugElement.nativeElement.querySelector('#reset-password-button');

    // Act
    component.email = 'test@example.com';  // Valid email
    fixture.detectChanges();

    // Assert
    expect(submitButton.disabled).toBeFalse();
  });
});
