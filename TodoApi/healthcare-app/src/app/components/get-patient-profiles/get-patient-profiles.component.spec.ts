import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPatientProfilesComponent } from './get-patient-profiles.component';

describe('GetPatientProfilesComponent', () => {
  let component: GetPatientProfilesComponent;
  let fixture: ComponentFixture<GetPatientProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetPatientProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPatientProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
