import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffAdminComponent } from './create-staff-admin.component';

describe('CreateStaffAdminComponent', () => {
  let component: CreateStaffAdminComponent;
  let fixture: ComponentFixture<CreateStaffAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
