import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOperationTypeAdminComponent } from './remove-operation-type-admin.component';

describe('RemoveOperationTypeAdminComponent', () => {
  let component: RemoveOperationTypeAdminComponent;
  let fixture: ComponentFixture<RemoveOperationTypeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveOperationTypeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveOperationTypeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
