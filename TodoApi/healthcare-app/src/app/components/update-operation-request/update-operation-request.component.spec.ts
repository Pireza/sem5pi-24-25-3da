import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOperationRequestComponent } from './update-operation-request.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class MockAuthService {
  getAllRequests = jasmine.createSpy('getAllRequests').and.returnValue(of([]));  // Ensure this returns an observable
  getAllPriorities = jasmine.createSpy('getAllPriorities').and.returnValue(of([])); // Ensure this returns an observable
  updateOperationRequestAsDoctor = jasmine.createSpy('updateOperationRequestAsDoctor').and.returnValue(of({})); // Ensure this returns an observable
}

class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));  // Adjusting navigate to return a Promise<boolean>
}

fdescribe('UpdateOperationRequestComponent', () => {
  let component: UpdateOperationRequestComponent;
  let fixture: ComponentFixture<UpdateOperationRequestComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule,UpdateOperationRequestComponent], 
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    fixture = TestBed.createComponent(UpdateOperationRequestComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  // Test for Initial Data Loading
  it('should load operation requests and priorities on init', () => {
    const mockRequests = [{ id: 1, name: 'Request 1' }];
    const mockPriorities = [{ id: 1, name: 'High' }];

    // Mock API responses
    authService.getAllRequests.and.returnValue(of(mockRequests));
    authService.getAllPriorities.and.returnValue(of(mockPriorities));

    // Call ngOnInit to trigger data loading
    component.ngOnInit();

    expect(authService.getAllRequests).toHaveBeenCalled();
    expect(authService.getAllPriorities).toHaveBeenCalled();
    expect(component.operationRequests).toEqual(mockRequests);
    expect(component.priorities).toEqual(mockPriorities);
  });

  // Test for Error Handling in Data Loading
  it('should handle error loading operation requests', () => {
    const error = new Error('Failed to load requests');
    authService.getAllRequests.and.returnValue(throwError(() => error));
    
    spyOn(window, 'alert'); // Spy on alert function

    component.ngOnInit();

    expect(authService.getAllRequests).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to load operation requests');
  });

  it('should handle error loading priorities', () => {
    const error = new Error('Failed to load priorities');
    authService.getAllPriorities.and.returnValue(throwError(() => error));
    
    spyOn(window, 'alert'); // Spy on alert function

    component.ngOnInit();

    expect(authService.getAllPriorities).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to load priorities');
  });

  // Test for Update Operation Request
  it('should update the operation request when valid inputs are provided', () => {
    const mockResponse = { success: true };
    authService.updateOperationRequestAsDoctor.and.returnValue(of(mockResponse));
    component.selectedRequestId = 1;
    component.selectedPriorityId = 1;
    component.deadline = '2024-12-31';

    spyOn(window, 'alert');  // Spy on alert function

    component.updateOperationRequestAsDoctor();

    expect(authService.updateOperationRequestAsDoctor).toHaveBeenCalledWith(1, 1, '31/12/2024');
    expect(window.alert).toHaveBeenCalledWith('Operation Request Updated!');
  });

  it('should show an error alert when update fails', () => {
    const error = new Error('Failed to update request');
    authService.updateOperationRequestAsDoctor.and.returnValue(throwError(() => error));

    spyOn(window, 'alert'); // Spy on alert function

    component.updateOperationRequestAsDoctor();

    expect(window.alert).toHaveBeenCalledWith('Please select a valid Operation Request');
  });

 

});
