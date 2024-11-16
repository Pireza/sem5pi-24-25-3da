import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatientProfileComponent } from './delete-patient-profile.component';

describe('DeletePatientProfileComponent', () => {
  let component: DeletePatientProfileComponent;
  let fixture: ComponentFixture<DeletePatientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePatientProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
