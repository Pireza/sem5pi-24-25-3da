import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userService'; // Import UserService
import { ResetPasswordComponent } from '../reset-password/reset-password.component'; // Import the reset-password component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [ResetPasswordComponent, CommonModule]
})
export class AuthComponent {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role
  isPasswordResetMode: boolean = false; // Control the visibility of the reset password form
  isAuthenticated: boolean = false; // Authentication state
  isSidebarOpen: boolean = false; // Sidebar visibility state

  submenuStates: { [key: string]: boolean } = {};
  menuItems: { label: string }[] = [];
  highlightedItems: { [key: string]: boolean } = {};


  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

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
        { label: 'Schedule Surgeries', isAction: true },  // This is an action item, not a submenu
      ];
    } else if (this.userRole === 'Doctor') {
      return [
        { label: 'Manage Operation Requests' },
        { label: '3D Visualization of the Floor', isAction: true },  // This is an action item, not a submenu
      ];
    } else if (this.userRole === 'Patient') {
      return [
        { label: 'Manage Profile' },
        { label: 'Return to Login', isAction: true },  // This is an action item, not a submenu
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
    this.submenuStates[menuItem] = !this.submenuStates[menuItem]; // Toggle the submenu visibility
  }

  handleClick(action: string) {
    console.log(`Action clicked: ${action}`);
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

}
