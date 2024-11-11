import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStaffAdminComponent } from './edit-staff-admin.component';

describe('EditStaffAdminComponent', () => {
  let component: EditStaffAdminComponent;
  let fixture: ComponentFixture<EditStaffAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStaffAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStaffAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
