import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientAdminComponent } from './create-patient-admin.component';

describe('CreatePatientAdminComponent', () => {
  let component: CreatePatientAdminComponent;
  let fixture: ComponentFixture<CreatePatientAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePatientAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
