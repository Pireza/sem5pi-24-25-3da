import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveOperationTypeAdminComponent } from './remove-operation-type-admin.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { OperationType } from '../../Models/OperationType';

fdescribe('RemoveOperationTypeAdminComponent', () => {
  let component: RemoveOperationTypeAdminComponent;
  let fixture: ComponentFixture<RemoveOperationTypeAdminComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getActiveTypes',
      'deactivateOperationTypeAsAdmin'
    ]);

    await TestBed.configureTestingModule({
      imports: [RemoveOperationTypeAdminComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveOperationTypeAdminComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os tipos de operação ativos ao inicializar', () => {
    const operationTypes: OperationType[] = [
      { id: 1, name: 'Type A' },
      { id: 2, name: 'Type B' }
    ];
    authServiceSpy.getActiveTypes.and.returnValue(of(operationTypes));

    component.ngOnInit();

    expect(component.operationTypes).toEqual(operationTypes);
    expect(authServiceSpy.getActiveTypes).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('deve lidar com erro ao carregar tipos de operação', () => {
    const error = new Error('Erro ao carregar tipos de operação');
    authServiceSpy.getActiveTypes.and.returnValue(throwError(error));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Failed to load operation types.');
    expect(authServiceSpy.getActiveTypes).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('deve desativar o tipo de operação selecionado', () => {
    component.selectedOperationTypeId = 1;
    authServiceSpy.deactivateOperationTypeAsAdmin.and.returnValue(of(undefined));
    spyOn(component, 'loadActiveOperationTypes');
    spyOn(window, 'alert');

    component.deactivateOperationType();

    expect(authServiceSpy.deactivateOperationTypeAsAdmin).toHaveBeenCalledWith(1);
    expect(component.loadActiveOperationTypes).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Operation type deactivated successfully.');
  });

  it('deve lidar com erro ao desativar um tipo de operação', () => {
    component.selectedOperationTypeId = 1;
    const error = new Error('Erro ao desativar tipo de operação');
    authServiceSpy.deactivateOperationTypeAsAdmin.and.returnValue(throwError(error));
    spyOn(window, 'alert');

    component.deactivateOperationType();

    expect(authServiceSpy.deactivateOperationTypeAsAdmin).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Failed to deactivate operation type.');
  });

  it('deve exibir mensagem ao tentar desativar sem selecionar um tipo de operação', () => {
    component.selectedOperationTypeId = undefined;
    spyOn(window, 'alert');

    component.deactivateOperationType();

    expect(window.alert).toHaveBeenCalledWith('Please select an operation type to deactivate.');
    expect(authServiceSpy.deactivateOperationTypeAsAdmin).not.toHaveBeenCalled();
  });
});
