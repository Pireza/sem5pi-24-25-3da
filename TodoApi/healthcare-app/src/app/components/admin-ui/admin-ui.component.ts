import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { UserService } from '../../services/userService'; // Import UserService

@Component({
  selector: 'app-admin-ui',
  standalone: true,
  imports: [],
  templateUrl: './admin-ui.component.html',
  styleUrls: ['./admin-ui.component.css'] // Fix 'styleUrl' to 'styleUrls'
})
export class AdminUiComponent implements OnInit {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userEmail = this.userService.userEmail; // Get the user's email from AuthService
    this.userRole = this.userService.userRole;   // Get the user's role from AuthService
  }
  redirectToPatientProfiles(): void {
    this.router.navigate(['/get-patient-profiles']);
  }

  redirectToCreatePatientProfiles(): void {
    this.router.navigate(['/create-patient-admin']);
  }
  redirectToListOperationTypes(): void {
    this.router.navigate(['/list-operation-types']);
  }
  redirectToAddOperationTypes(): void {
    this.router.navigate(['/add-operation-type']);
  }
  redirectToRegisterStaff(): void {
    this.router.navigate(['/register-staff']);
  }
  redirectToEditPatientProfile(): void {
    this.router.navigate(['/edit-patient-profile-admin']);
  }
  redirectToCreateStaff(): void {
    this.router.navigate(['/create-staff-admin']);
  }
  redirectToEditStaff(): void {
    this.router.navigate(['/edit-staff-admin']);
  }
  redirectToPlanning(): void {
    this.router.navigate(['/planning']);
  }
  redirectToRemoveOperationType(): void{
    this.router.navigate(['/remove-operation-type-admin']);
  }
  redirectToDeletePatientProfile(): void{
    this.router.navigate(['/delete-patient-profile-admin']);
  }
  redirectToDeleteStaffProfile(): void{
    this.router.navigate(['/deactivate-staff-profile-admin']);
  }
  redirectToSearchStaffProfile(): void{
    this.router.navigate(['/filter-staff-admin']);
  }
  redirectToEditOperationType(): void{
    this.router.navigate(['/update-operation-type']);
  }
}
