import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRequestsComponent } from './filter-requests.component';

describe('FilterRequestsComponent', () => {
  let component: FilterRequestsComponent;
  let fixture: ComponentFixture<FilterRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
