import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetPatientProfilesComponent } from './get-patient-profiles.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

fdescribe('GetPatientProfilesComponent', () => {
  let component: GetPatientProfilesComponent;
  let fixture: ComponentFixture<GetPatientProfilesComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['searchPatientProfiles']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule,GetPatientProfilesComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GetPatientProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with clear search fields', () => {
    component.ngOnInit();
    expect(component.name).toBe('');
    expect(component.email).toBe('');
    expect(component.dateOfBirth).toBe('');
    expect(component.medicalNumber).toBeNull();
    expect(component.searchResults).toEqual([]);
    expect(component.totalRecords).toBe(0);
  });

  it('should call clearSearchFields method', () => {
    component.clearSearchFields();
    expect(component.name).toBe('');
    expect(component.email).toBe('');
    expect(component.dateOfBirth).toBe('');
    expect(component.medicalNumber).toBeNull();
    expect(component.searchResults).toEqual([]);
    expect(component.totalRecords).toBe(0);
  });

 

  it('should call searchPatientProfiles method on onSearch', () => {
    const searchResponse = {
      totalRecords: 10,
      patients: [{ email: 'test@example.com', name: 'John Doe' }]
    };

    authService.searchPatientProfiles.and.returnValue(of(searchResponse));

    component.name = 'John';
    component.email = 'test@example.com';
    component.dateOfBirth = '1990-01-01';
    component.medicalNumber = 12345;

    component.onSearch();
    expect(authService.searchPatientProfiles).toHaveBeenCalledWith(
      'John',
      'test@example.com',
      '01/01/1990',
      12345,
      1,
      10
    );
    expect(component.searchResults).toEqual(searchResponse.patients);
    expect(component.totalRecords).toBe(10);
  });

  it('should handle search error correctly', () => {
    authService.searchPatientProfiles.and.returnValue(throwError('Search failed'));
    component.onSearch();
    expect(component.searchResults).toEqual([]);
    expect(component.totalRecords).toBe(0);
  });

  it('should go to the next page when nextPage is called', () => {
    const searchResponse = {
      totalRecords: 30,
      patients: [{ email: 'test@example.com', name: 'John Doe' }]
    };
  
    // Ensure searchPatientProfiles returns an observable
    authService.searchPatientProfiles.and.returnValue(of(searchResponse));
  
    component.page = 1;
    component.pageSize = 10;
    component.totalRecords = 30;
  
    component.nextPage();  // Try to go to the next page
  
    expect(component.page).toBe(2);  // The page should be incremented
    expect(authService.searchPatientProfiles).toHaveBeenCalled();
  });

  it('should not go to the next page if total records are not sufficient', () => {
    component.page = 3;
    component.pageSize = 10;
    component.totalRecords = 25;

    component.nextPage();
    expect(component.page).toBe(3); // No change
  });

  it('should go to the previous page when previousPage is called', () => {
    const searchResponse = {
      totalRecords: 30,
      patients: [{ email: 'test@example.com', name: 'John Doe' }]
    };
  
    // Ensure searchPatientProfiles returns an observable
    authService.searchPatientProfiles.and.returnValue(of(searchResponse));
  
    component.page = 2;
    component.pageSize = 10;
  
    component.previousPage();  // Try to go to the previous page
  
    expect(component.page).toBe(1);  // The page should be decremented
    expect(authService.searchPatientProfiles).toHaveBeenCalled();
  });

  it('should not go to the previous page if already on the first page', () => {
    component.page = 1;
    component.pageSize = 10;

    component.previousPage();
    expect(component.page).toBe(1); // No change
  });

  it('should format the date correctly', () => {
    const testDate = new Date('1990-01-01');
    const formattedDate = component.formatDateToDDMMYYYY(testDate);
    expect(formattedDate).toBe('01/01/1990');
  });
});
