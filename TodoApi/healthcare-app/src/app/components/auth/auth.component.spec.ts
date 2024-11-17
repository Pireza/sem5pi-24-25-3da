import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import here

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: AuthService;
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule  // Add this module
      ],
      declarations: [AuthComponent],
      providers: [
        AuthService,
        UserService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle authentication error', () => {
    spyOn(authService, 'authenticateUser').and.returnValue(throwError('Authentication failed'));
    spyOn(console, 'error');

    component.onAuthenticate();

    expect(console.error).toHaveBeenCalledWith('Authentication failed:', 'Authentication failed');
  });

  it('should navigate to registerClient page on create account', () => {
    spyOn(router, 'navigate');

    component.onCreateAccountClient();

    expect(router.navigate).toHaveBeenCalledWith(['/registerClient']);
  });

  it('should navigate to reset-password page on password reset', () => {
    spyOn(router, 'navigate');

    component.onPasswordReset();

    expect(router.navigate).toHaveBeenCalledWith(['/reset-password']);
  });
});
