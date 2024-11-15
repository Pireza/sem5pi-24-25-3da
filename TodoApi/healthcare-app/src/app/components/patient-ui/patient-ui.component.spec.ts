import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientUIComponent } from './patient-ui.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService';
import { of, throwError } from 'rxjs';

class MockAuthService {
  deletePatientByEmail = jasmine.createSpy('deletePatientByEmail').and.returnValue(of({}));
}

class MockUserService {
  userEmail = 'test@example.com'; // Mock email for the user
  userRole = 'Patient'; // Mock user role
}

fdescribe('PatientUIComponent', () => {
  let component: PatientUIComponent;
  let fixture: ComponentFixture<PatientUIComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientUIComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: Router },
        { provide: UserService, useClass: MockUserService }, // Mock the UserService here

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientUIComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  beforeEach(() => {
    spyOn(window, 'alert'); // Mock the alert globally
  });

  afterEach(() => {
    (authService.deletePatientByEmail as jasmine.Spy).calls.reset();
    (window.alert as jasmine.Spy).calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onDeletePatient', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
      spyOn(window, 'confirm').and.returnValue(true); // Simulate user confirming
    });

    it('should call deletePatientByEmail when confirmed', () => {
      component.onDeletePatient();

      expect(authService.deletePatientByEmail).toHaveBeenCalledWith('test@example.com');
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
      expect(window.alert).toHaveBeenCalledWith('Your account will be deleted in 30 days as per RGPD standarts.');
    });

    it('should not call deletePatientByEmail when canceled', () => {
      (window.confirm as jasmine.Spy).and.returnValue(false); 

      component.onDeletePatient();

      expect(authService.deletePatientByEmail).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
  describe('goBack', () => {
    it('should navigate to /auth', () => {
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });
});

