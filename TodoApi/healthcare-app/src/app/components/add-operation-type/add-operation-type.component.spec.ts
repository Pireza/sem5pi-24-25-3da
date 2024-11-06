import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperationTypeComponent } from './add-operation-type.component';

describe('AddOperationTypeComponent', () => {
  let component: AddOperationTypeComponent;
  let fixture: ComponentFixture<AddOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOperationTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
