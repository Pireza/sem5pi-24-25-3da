import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUiComponent } from './doctor-ui.component';

describe('DoctorUiComponent', () => {
  let component: DoctorUiComponent;
  let fixture: ComponentFixture<DoctorUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
