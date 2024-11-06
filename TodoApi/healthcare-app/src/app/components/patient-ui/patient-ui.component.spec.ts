import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUIComponent } from './patient-ui.component';

describe('PatientUIComponent', () => {
  let component: PatientUIComponent;
  let fixture: ComponentFixture<PatientUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
