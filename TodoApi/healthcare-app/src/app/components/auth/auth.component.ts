import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userService';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ListOperationTypesComponent } from '../list-operation-types/list-operation-types.component'; // Import ListOperationTypesComponent
import { AddOperationTypeComponent } from '../add-operation-type/add-operation-type.component'; // Correct import
import { FilterRequestsComponent } from '../filter-requests/filter-requests.component';
import { CreateStaffAdminComponent } from '../create-staff-admin/create-staff-admin.component';
import { CreatePatientAdminComponent } from '../create-patient-admin/create-patient-admin.component';
import { EditPatientProfileAdminComponent } from '../edit-patient-profile-admin/edit-patient-profile-admin.component';
import { UpdateOperationRequestComponent } from '../update-operation-request/update-operation-request.component';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';
import { GetPatientProfilesComponent } from '../get-patient-profiles/get-patient-profiles.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [ResetPasswordComponent, CommonModule, AddOperationTypeComponent, FilterRequestsComponent, CreateStaffAdminComponent, CreatePatientAdminComponent, EditPatientProfileAdminComponent] 
})
export class AuthComponent {
  userEmail: string | null = null;
  userRole: string | null = null;
  isPasswordResetMode: boolean = false;
  isAuthenticated: boolean = false;
  isSidebarOpen: boolean = false;

  submenuStates: { [key: string]: boolean } = {};
  menuItems: { label: string }[] = [];
  highlightedItems: { [key: string]: boolean } = {};
  activeComponent: any = null;  // Variable to store the dynamically loaded component
  navbarHeight: number = 80;
  
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    // Calculate the navbar height dynamically if needed
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      this.navbarHeight = navbar.clientHeight;
    }
  }

  onAuthenticate() {
    this.authService.authenticateUser().subscribe({
      next: () => {
        if (this.authService.isAuthenticated) {
          this.userEmail = this.userService.userEmail;
          this.userRole = this.userService.userRole;
          this.isAuthenticated = true;

          this.menuItems = this.getMenuItems();
        }
      },
      error: (error) => console.error('Authentication failed:', error),
    });
  }

  onCreateAccountClient() {
    this.router.navigate(['/registerClient']);
  }

  onPasswordReset() {
    this.isPasswordResetMode = true;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getMenuItems() {
    if (this.userRole === 'Admin') {
      return [
        { label: 'Manage Patients' },
        { label: 'Manage Staff' },
        { label: 'Manage Operation Types' },
        { label: 'Schedule Surgeries', isAction: true },
      ];
    } else if (this.userRole === 'Doctor') {
      return [
        { label: 'Manage Operation Requests' },
        { label: '3D Visualization of the Floor', isAction: true },
      ];
    } else if (this.userRole === 'Patient') {
      return [
        { label: 'Manage Profile' },
        { label: 'Return to Login', isAction: true },
      ];
    }
    return [];
  }

  onMenuItemClick(menuItem: any) {
    if (menuItem.isAction) {
      this.handleClick(menuItem.label);
    } else {
      this.toggleSubmenu(menuItem.label);
      this.toggleHighlight(menuItem.label);
    }
  }

  toggleSubmenu(menuItem: string) {
    this.submenuStates[menuItem] = !this.submenuStates[menuItem];
  }

  handleClick(action: string) {
    console.log(`Action clicked: ${action}`);
    if (action === 'Search Operation Types') {
      this.activeComponent = ListOperationTypesComponent; // Dynamically load ListOperationTypesComponent
    }else if(action === 'Add New Operation Type'){
      this.activeComponent = AddOperationTypeComponent;
    }else if(action === 'Search Operation Requests'){
      this.activeComponent = FilterRequestsComponent;
    }else if (action === 'Create a New Staff User'){
      this.activeComponent = CreateStaffAdminComponent;
    }else if (action === 'Create Patient Profile'){
      this.activeComponent = CreatePatientAdminComponent;
    }else if (action === 'Edit Patient Profiles'){
      this.activeComponent = EditPatientProfileAdminComponent;
    }else if(action === 'Update Operation Request'){
      this.activeComponent= UpdateOperationRequestComponent;
    }else if(action === 'Update Profile'){
      this.activeComponent=UpdateProfileComponent;
    }else if(action==='Delete Account'){
      this.onDeletePatient();
    }else if(action==='Search Patients'){
      this.activeComponent=GetPatientProfilesComponent;
    }
  }

  getSubmenuItems(menuItem: string) {
    if (menuItem === 'Manage Patients') {
      return ['Search Patients', 'Edit Patient Profiles', 'Create Patient Profile'];
    } else if (menuItem === 'Manage Staff') {
      return ['Register New Staff User', 'Create a New Staff User', 'Edit Staff Profile'];
    } else if (menuItem === 'Manage Operation Types') {
      return ['Add New Operation Type', 'Search Operation Types', 'Delete Operation Type'];
    } else if (menuItem === 'Manage Operation Requests') {
      return ['Search Operation Requests', 'Update Operation Request', 'Remove Operation Request'];
    } else if (menuItem === 'Manage Profile') {
      return ['Update Profile', 'Delete Account'];
    }
    return [];
  }

  toggleHighlight(menuItem: string) {
    this.highlightedItems[menuItem] = !this.highlightedItems[menuItem];
  }
  onDeletePatient(): void {
    if (this.userEmail) {
      const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmation) {

      this.authService.deletePatientByEmail(this.userEmail).subscribe({
        next: () => {
          console.log('Patient deleted successfully');
          alert('Your account will be deleted in 30 days as per RGPD standarts.');
          this.router.navigate(['/auth']);
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
          alert('An error occurred while trying to delete the patient.');
        }
      });
    }
    } else {
      alert('User email is not available.');
    }
  }
}
