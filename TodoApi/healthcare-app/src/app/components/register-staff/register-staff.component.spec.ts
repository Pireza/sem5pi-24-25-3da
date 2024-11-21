import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
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

  it('should display "loading" state while processing the form submission', fakeAsync(() => {
    const formData = {
      username: 'testuser',
      email: 'testuser@example.com',
      role: 'admin',
    };

    // Mock the service call to resolve after some time
    authServiceSpy.registerStaff.and.returnValue(of(null)); // Mock success response

    // Act: Set form values and submit
    component.registerForm.setValue(formData);
    component.onSubmit();

    // Assert that the loading state is true before HTTP completes
    expect(component.loading).toBeTrue();

    // Simulate the passage of time for the async operation to complete
    tick(); // This will let the observable complete

    // Assert: After HTTP call completes, loading should be false
    expect(component.loading).toBeFalse();
  }));
});
