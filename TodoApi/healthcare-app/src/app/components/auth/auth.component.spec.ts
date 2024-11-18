import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthComponent } from './auth.component';  // Correct import
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userService';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

fdescribe('AuthComponent', () => {
  let component: AuthComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['authenticateUser', 'deletePatientByEmail']);
    userService = jasmine.createSpyObj('UserService', [], { userEmail: 'test@example.com', userRole: 'Admin' });
    router = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']); // spy on navigateByUrl instead

    await TestBed.configureTestingModule({
      imports: [CommonModule], // Only necessary modules
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('should initialize navbar height', () => {
    spyOn(document, 'querySelector').and.returnValue({ clientHeight: 100 } as HTMLElement);
    component.ngOnInit();
    expect(component.navbarHeight).toBe(100);
  });

  it('should handle authentication error', fakeAsync(() => {
    authService.authenticateUser.and.returnValue(throwError(() => new Error('Authentication failed')));
    component.onAuthenticate();
    tick();
    expect(authService.authenticateUser).toHaveBeenCalled();
    expect(component.isAuthenticated).toBeFalse();
  }));

  it('should toggle sidebar visibility', () => {
    component.isSidebarOpen = false;
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();
  });

  describe('onDeletePatient', () => {
    beforeEach(() => {
      spyOn(window, 'confirm').and.returnValue(true); // Simulate user confirming
      spyOn(window, 'alert'); // Spy on alert to check for RGPD message
      authService.deletePatientByEmail.and.returnValue(of(undefined)); // Mock delete operation once
  
      // Spy on resetPage to prevent it from being executed during tests
      spyOn(component, 'resetPage');
    });
  
    it('should call deletePatientByEmail when confirmed', () => {
      const email = 'test@example.com';
      component.userEmail = email;  // Ensure userEmail is set
  
      component.onDeletePatient(); // Trigger the delete method
  
      // Assert that the delete method is called with the correct email
      expect(authService.deletePatientByEmail).toHaveBeenCalledWith(email);
  
      // Assert that the alert for account deletion is shown
      expect(window.alert).toHaveBeenCalledWith('Your account will be deleted in 30 days as per RGPD standarts.');
    });
  
    it('should not call deletePatientByEmail when canceled', fakeAsync(() => {
      (window.confirm as jasmine.Spy).and.returnValue(false); // Simulate user canceling deletion
      component.onDeletePatient();
  
      tick(); // simulate async passage of time
  
      expect(authService.deletePatientByEmail).not.toHaveBeenCalled();
      expect(component.resetPage).not.toHaveBeenCalled(); // Ensure resetPage is not called
    }));
  });
  
  
  
  
});
