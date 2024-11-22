import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { UserService } from '../../services/userService'; // Import UserService

@Component({
  selector: 'app-doctor-ui',
  standalone: true,
  imports: [],
  templateUrl: './doctor-ui.component.html',
  styleUrls: ['./doctor-ui.component.css'] // Fix 'styleUrl' to 'styleUrls'
})
export class DoctorUiComponent implements OnInit {
  userEmail: string | null = null; // To hold the user's email
  userRole: string | null = null;   // To hold the user's role

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userEmail = this.userService.userEmail; // Get the user's email from AuthService
    this.userRole = this.userService.userRole;   // Get the user's role from AuthService
  }
  redirectToFilterRequests(): void {
    this.router.navigate(['/filter-requests']);
  }

  redirectToCreateOperationRequests(): void {
    this.router.navigate(['/create-operation-doctor']);
  }
  redirectToUpdateOperationRequests(): void {
    this.router.navigate(['/update-operation-request']);
    }
    seeRepresentationOfTheClinic(): void{
      window.open('http://192.168.56.1:5500/TodoApi/3D-Module/Basic_Thumb_Raiser_template/Thumb_Raiser.html', '_blank');
    }

    redirectToDeleteOperationRequests(): void {
      this.router.navigate(['/remove-operation-doctor']);
      }
}
