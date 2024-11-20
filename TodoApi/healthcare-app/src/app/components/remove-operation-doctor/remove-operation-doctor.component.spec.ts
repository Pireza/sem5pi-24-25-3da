import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteOperationRequestComponent } from './remove-operation-doctor.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing'; 

fdescribe('DeleteOperationRequestComponent', () => {
  let component: DeleteOperationRequestComponent;
  let fixture: ComponentFixture<DeleteOperationRequestComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAllRequests', 'deleteOperationRequestAsDoctor']);
  
    // Provide a default return value for getAllRequests
    authServiceSpy.getAllRequests.and.returnValue(of([])); 
  
    await TestBed.configureTestingModule({
      imports: [DeleteOperationRequestComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();
  
    fixture = TestBed.createComponent(DeleteOperationRequestComponent);
    component = fixture.componentInstance;
  });
  

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as solicitações de operação', () => {
    const requests = [
      { id: 1, patientName: 'Paciente A', description: 'Descrição A' },
      { id: 2, patientName: 'Paciente B', description: 'Descrição B' }
    ];
    authServiceSpy.getAllRequests.and.returnValue(of(requests));

    component.ngOnInit();

    expect(component.operationRequests).toEqual(requests);
    expect(authServiceSpy.getAllRequests).toHaveBeenCalled();
  });

  it('deve lidar com erros ao carregar solicitações', () => {
    const error = new Error('Erro ao carregar solicitações');
    authServiceSpy.getAllRequests.and.returnValue(throwError(error));
    spyOn(window, 'alert'); 

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Failed to load operation requests'); 
    expect(authServiceSpy.getAllRequests).toHaveBeenCalled();
  });

  it('deve excluir uma solicitação de operação', () => {
    component.selectedRequestId = 1;
    authServiceSpy.deleteOperationRequestAsDoctor.and.returnValue(of(undefined));
    spyOn(window, 'alert');

    component.deleteOperationRequest();

    expect(authServiceSpy.deleteOperationRequestAsDoctor).toHaveBeenCalledWith(1);
    expect(component.selectedRequestId).toBeUndefined(); 
    expect(window.alert).toHaveBeenCalledWith('Operation Request Deleted!'); 
  });

  it('deve lidar com erros ao excluir uma solicitação', () => {
    component.selectedRequestId = 1;
    const error = new Error('Erro ao excluir solicitação');
    authServiceSpy.deleteOperationRequestAsDoctor.and.returnValue(throwError(error));
    spyOn(window, 'alert');

    component.deleteOperationRequest();

    expect(authServiceSpy.deleteOperationRequestAsDoctor).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Failed to delete operation request'); 
  });

  it('deve exibir uma mensagem se nenhuma solicitação for selecionada', () => {
    component.selectedRequestId = undefined;
    spyOn(window, 'alert');

    component.deleteOperationRequest();

    expect(window.alert).toHaveBeenCalledWith('Please select a valid Operation Request');
  });

  it('deve redefinir o formulário após a exclusão', () => {
    // Mock implementation for getAllRequests
    authServiceSpy.getAllRequests.and.returnValue(of([])); // Return an empty array for simplicity
  
    component.selectedRequestId = 1; // Set a valid selectedRequestId
    
    component.resetForm();
  
    expect(component.selectedRequestId).toBeUndefined(); // Verify the form was reset
    expect(authServiceSpy.getAllRequests).toHaveBeenCalled(); // Ensure loadRequests was called
  });
  
});