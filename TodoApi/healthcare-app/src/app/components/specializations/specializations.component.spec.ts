import { TestBed, ComponentFixture, waitForAsync, tick, fakeAsync } from '@angular/core/testing';
import { SpecializationsComponent } from './specializations.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

fdescribe('SpecializationsComponent', () => {
    let component: SpecializationsComponent;
    let fixture: ComponentFixture<SpecializationsComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    const mockSpecializations = [
        { specId: 1, specDescription: 'Spec 1', specLongDescription: 'Description 1' },
        { specId: 2, specDescription: 'Spec 2', specLongDescription: 'Description 2' }
    ];

    beforeEach(waitForAsync(() => {
        const spy = jasmine.createSpyObj('AuthService', [
            'getAllSpecializations',
            'updateSpecialization',
            'createSpecialization',
            'deleteSpecialization'
        ]);

        TestBed.configureTestingModule({
            imports: [SpecializationsComponent], // Include here since it's standalone
            providers: [{ provide: AuthService, useValue: spy }]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(SpecializationsComponent);
        component = fixture.componentInstance;

        // Reset the spy and mock data for each test
        authServiceSpy.getAllSpecializations.and.returnValue(of([...mockSpecializations])); // Clone array
        component.allSpecializations = [...mockSpecializations];
        fixture.detectChanges();
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch specializations on initialization', () => {
        expect(authServiceSpy.getAllSpecializations).toHaveBeenCalled();
        expect(component.allSpecializations).toEqual(mockSpecializations);
        expect(component.isLoading).toBeFalse();
    });

    it('should display fetched specializations in the table', () => {
        const rows = fixture.debugElement.queryAll(By.css('table tbody tr'));
        expect(rows.length).toBe(2);
        expect(rows[0].nativeElement.textContent).toContain('Spec 1');
        expect(rows[1].nativeElement.textContent).toContain('Spec 2');
    });

    it('should show add form when onAdd is called', () => {
        component.onAdd();
        fixture.detectChanges();

        const form = fixture.debugElement.query(By.css('form'));
        expect(form).toBeTruthy();
        expect(component.isAdding).toBeTrue();
        expect(component.isEditing).toBeFalse();
    });

    it('should populate the form when onEdit is called', () => {
        const specToEdit = mockSpecializations[0];
        component.onEdit(specToEdit);
        fixture.detectChanges();

        expect(component.specializationForm.value.specDescription).toBe(specToEdit.specDescription);
        expect(component.specializationForm.value.specLongDescription).toBe(specToEdit.specLongDescription);
        expect(component.isEditing).toBeTrue();
        expect(component.isAdding).toBeFalse();
    });

    it('should reset form and state when onCancel is called', () => {
        component.onCancel();
        fixture.detectChanges();

        expect(component.isEditing).toBeFalse();
        expect(component.isAdding).toBeFalse();
        expect(component.specializationForm.pristine).toBeTrue();
    });

    it('should call createSpecialization on save when adding a new specialization', () => {
        authServiceSpy.createSpecialization.and.returnValue(of({ specId: 3, specDescription: 'New Spec', specLongDescription: 'New Description' }));
        component.onAdd();
        component.specializationForm.setValue({ specDescription: 'New Spec', specLongDescription: 'New Description' });

        component.onSave();
        expect(authServiceSpy.createSpecialization).toHaveBeenCalledWith({
            specDescription: 'New Spec',
            specLongDescription: 'New Description'
        });
        expect(component.allSpecializations.length).toBe(3);
    });




    it('should call deleteSpecialization and update the list on successful deletion', () => {
        const specToDelete = mockSpecializations[0];
        spyOn(window, 'confirm').and.returnValue(true); // Mock confirmation dialog
        authServiceSpy.deleteSpecialization.and.returnValue(of({}));

        component.onDelete(specToDelete);
        expect(authServiceSpy.deleteSpecialization).toHaveBeenCalledWith(specToDelete.specId);
        expect(component.allSpecializations.length).toBe(1);
        expect(component.allSpecializations[0].specId).toBe(2);
    });

    it('should not call deleteSpecialization if deletion is not confirmed', () => {
        const specToDelete = mockSpecializations[0];
        spyOn(window, 'confirm').and.returnValue(false); // Mock confirmation dialog

        component.onDelete(specToDelete);
        expect(authServiceSpy.deleteSpecialization).not.toHaveBeenCalled();
        expect(component.allSpecializations.length).toBe(2);
    });
});
