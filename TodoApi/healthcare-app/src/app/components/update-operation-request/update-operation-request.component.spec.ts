import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOperationRequestComponent } from './update-operation-request.component';

describe('UpdateOperationRequestComponent', () => {
  let component: UpdateOperationRequestComponent;
  let fixture: ComponentFixture<UpdateOperationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOperationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOperationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
