import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatientProfileAdminComponent } from './components/delete-patient-profile-admin/delete-patient-profile-admin.component';

describe('DeletePatientProfileComponent', () => {
  let component: DeletePatientProfileAdminComponent;
  let fixture: ComponentFixture<DeletePatientProfileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePatientProfileAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePatientProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
