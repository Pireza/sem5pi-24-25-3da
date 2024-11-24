import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOperationDoctorComponent } from './create-operation-doctor.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

fdescribe('CreateOperationDoctorComponent', () => {
  let component: CreateOperationDoctorComponent;
  let fixture: ComponentFixture<CreateOperationDoctorComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['createOperationRequestAsDoctor']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateOperationDoctorComponent, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOperationDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are not filled', () => {
    spyOn(window, 'alert');
    component.operationRequest = {
      patientId: 0,
      operationTypeId: 0,
      priorityId: 0,
      deadline: '',
    };

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields!');
    expect(authServiceMock.createOperationRequestAsDoctor).not.toHaveBeenCalled();
  });

  it('should call AuthService with correct request on valid input', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(of('Operation request created successfully'));

    component.onSubmit();

    expect(authServiceMock.createOperationRequestAsDoctor).toHaveBeenCalledWith(component.operationRequest);
  });

  it('should navigate to doctor dashboard on successful operation creation', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(of('Operation request created successfully'));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Operation request created successfully');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/doctor-dashboard']);
  });

  it('should alert on unexpected server response', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(of('Unexpected server message'));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Unexpected response from the server. Please contact support.');
  });

  it('should alert on connection error (status 0)', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(throwError({ status: 0 }));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Unable to connect to the server. Please try again later.');
  });

  it('should alert with error message if error.error is a string', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    const mockError = { status: 400, error: 'Invalid operation request' };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(throwError(mockError));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error: Invalid operation request');
  });

  it('should alert with error message if error.error.message exists', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    const mockError = { status: 400, error: { message: 'Missing required fields' } };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(throwError(mockError));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error: Missing required fields');
  });

  it('should alert with a generic error message for unknown errors', () => {
    component.operationRequest = {
      patientId: 1,
      operationTypeId: 2,
      priorityId: 3,
      deadline: '2024-12-01',
    };
    authServiceMock.createOperationRequestAsDoctor.and.returnValue(throwError({ status: 500 }));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('An unknown error occurred. Please contact support.');
  });
});
