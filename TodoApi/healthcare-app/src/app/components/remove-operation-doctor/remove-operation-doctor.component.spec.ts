import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOperationRequestComponent } from './remove-operation-doctor.component';

describe('RemoveOperationDoctorComponent', () => {
  let component: DeleteOperationRequestComponent;
  let fixture: ComponentFixture<DeleteOperationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOperationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOperationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
