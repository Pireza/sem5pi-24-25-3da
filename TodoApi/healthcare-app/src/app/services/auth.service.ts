import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreatePatientRequest } from '../Models/CreatePatientRequest';
import jwt_decode from 'jwt-decode'; // Use wildcard import
import { UserService } from './userService'; // Import UserService

// Update the DecodedToken interface to include the roles property
export interface DecodedToken {
  email: string;
  roles: string[]; // Use roles as an array
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:5174/api/Patients/authenticate';
  public registerUrl = 'http://localhost:5174/api/Patients/registerPatientViaAuth0'; 
  public deletePatientUrl = 'http://localhost:5174/api/Patients/deleteUserByEmail'; 
  public updateProfileAsPatientUrl = 'http://localhost:5174/api/Patients/email/UpdateProfile';
  public searchPatientProfilesUrl = 'http://localhost:5174/api/Patients/searchPatientProfiles'; 

  public isAuthenticated: boolean = false;
  public userEmail: string | null = null; // To store the decoded email
  public userRole: string | null = null;   // To store the decoded role
  private accessToken: string | null = null; // Store the access token

  constructor(private http: HttpClient,private userService: UserService) {}

  // Authentication method
  authenticateUser(): Observable<any> {
    return this.http.post(this.apiUrl, {}).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          this.isAuthenticated = true;
          this.accessToken = response.accessToken; // Save the access token
          this.userService.accessToken = this.accessToken; // Store access token in UserService

          // Decode the token
          const decodedToken: any = jwt_decode(response.accessToken);

          // Extract the email and roles from the decoded token
          this.userEmail = decodedToken.email; // Extract the email
          this.userService.userEmail= this.userEmail;
          // Check for the roles in the correct key
          this.userRole = decodedToken['http://dev-b2f7avjyddz6kpot.us.auth0.comroles']?.[0] || null; // Extract the first role
          this.userService.userRole= this.userRole;
          console.log(this.userRole);

        }
      })
    );
  }
  deletePatientByEmail(email: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Set the Authorization header
    });
    return this.http.delete<void>(`${this.deletePatientUrl}/${email}`, { headers });
  }

  // Registration method
  registerPatient(patientData: CreatePatientRequest): Observable<any> {
    return this.http.post(this.registerUrl, patientData);
  }

  updatePatientProfile(
    email: string,
    newEmail?: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    emergencyContact?: string
  ): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (newEmail) params.append('newEmail', newEmail);
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
    if (phone) params.append('phone', phone);
    if (emergencyContact) params.append('emergencyContact', emergencyContact);

    const requestUrl = `${this.updateProfileAsPatientUrl}/${encodeURIComponent(email)}?${params.toString()}`;
    return this.http.put<void>(requestUrl, {}, { headers });
  }
  searchPatientProfiles(
    name?: string,
    email?: string,
    dateOfBirth?: string,
    medicalNumber?: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Set the Authorization header
    });

    // Construct the URL with query parameters
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    if (dateOfBirth) params.append('dateOfBirth', dateOfBirth);
    if (medicalNumber) params.append('medicalNumber', medicalNumber.toString());
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.searchPatientProfilesUrl}?${params.toString()}`, { headers });
  }
}
