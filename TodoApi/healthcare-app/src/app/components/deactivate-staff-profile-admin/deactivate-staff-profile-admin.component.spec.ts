import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateStaffProfileAdminComponent } from './deactivate-staff-profile-admin.component';

describe('DeactivateStaffProfileAdminComponent', () => {
  let component: DeactivateStaffProfileAdminComponent;
  let fixture: ComponentFixture<DeactivateStaffProfileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateStaffProfileAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateStaffProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
