import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOperationDoctorComponent } from './remove-operation-doctor.component';

describe('RemoveOperationDoctorComponent', () => {
  let component: RemoveOperationDoctorComponent;
  let fixture: ComponentFixture<RemoveOperationDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveOperationDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveOperationDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
