import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientProfileAdminComponent } from './edit-patient-profile-admin.component';

describe('EditPatientProfileAdminComponent', () => {
  let component: EditPatientProfileAdminComponent;
  let fixture: ComponentFixture<EditPatientProfileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPatientProfileAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
