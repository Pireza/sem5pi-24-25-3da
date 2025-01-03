import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreatePatientRequest } from '../Models/CreatePatientRequest';
import jwt_decode from 'jwt-decode'; // Use wildcard import
import { UserService } from './userService'; // Import UserService
import { CreateOperationTypeRequest } from '../Models/CreateOperationTypeRequest';
import { OperationRequestSearch } from '../Models/OperationRequestSearch';
import { RegisterStaffRequest } from '../Models/RegisterStaffRequest';
import { OperationTypeSearch } from '../Models/OperationTypeSearch';
import { Patient } from '../Models/Patient';
import { Staff } from '../Models/Staff';
import { CreateStaffRequest } from '../Models/CreateStaffRequest';
import { OperationType } from '../Models/OperationType';
import { Specialization } from '../Models/Specialization'; // Import the Specialization model
import { map } from 'rxjs/operators';
import { UpdateOperationType } from '../Models/UpdateOperationType';
import { SpecializationSearch } from '../Models/SpecializationSearch';


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
  public createPatientProfileAsAdmin = 'http://localhost:5174/api/Patients/createPatientAsAdmin';
  public resetPasswordEP = 'http://localhost:5174/api/StaffUser/reset-password';
  public listTypesEP = 'http://localhost:5174/api/Operation/type/filter';
  public addTypeEP = 'http://localhost:5174/api/Operation/type';
  public listRequestsEP = 'http://localhost:5174/api/Operation/request/filter';
  public allSpecializedStaffEP = 'http://localhost:5174/api/Specialization/staff-complete';
  public registerStaffEp = 'http://localhost:5174/api/StaffUser/register';
  public updateOperationRequestDoctor = 'http://localhost:5174/api/OperationRequests';
  public listPrioritiesEP = 'http://localhost:5174/api/OperationRequests/Priorities';
  public listAllRequestsEP = 'http://localhost:5174/api/OperationRequests/All';
  public editPatientProfileAdmin = 'http://localhost:5174/api/Patients/email/UpdatePatientProfileAsAdmin'
  public getPatientUrl = 'http://localhost:5174/api/Patients/email';
  public createStaffAdmin = 'http://localhost:5174/api/StaffUser/CreateStaffAsAdmin';
  public editStaffAdmin = 'http://localhost:5174/api/StaffUser/email/UpdateStaffProfileAsAdmin';
  public deleteOperationDoctor = 'http://localhost:5174/api/OperationRequests/id/deleteOperationRequestAsDoctor';
  public removeOPerationType = 'http://localhost:5174/api/OperationType/removeOperationTypeAsAdmin';
  public deletePatientProfile = 'http://localhost:5174/api/Patients/deletePatientByEmailAsAdmin';
  public deactivateStaffProfile = 'http://localhost:5174/api/StaffUser/deactivate';
  public searchStaffProfilesUrl = 'http://localhost:5174/api/StaffUser/search';
  public getAllTypesNamesEP = 'http://localhost:5174/api/Operation/type-names';
  public getAllSpecsNamesEP = 'http://localhost:5174/api/Specialization/names';
  public createOperationRequestUrl = 'http://localhost:5174/api/OperationRequests/CreateOperationRequest'
  public updateOperationTypeUrl = 'http://localhost:5174/api/Operation/UpdateOperationTypeAsAdmin'

  public specsFuncsEP = 'http://localhost:5174/api/Specialization';
  public createAllergy = 'http://localhost:3000/api/createAllergy';
  public getAllPatients = 'http://localhost:5174/api/Patients/all';
  public getAllAllergies = 'http://localhost:3000/api/getAllAllergies';
  public createMedicalConditon = 'http://localhost:3000/api/createMedicalCondition';
  public getAllMedicalConditions = 'http://localhost:3000/api/getAllMedicalConditions';
  public getMedicalHistoryEP = 'http://localhost:3000/api/download-medical-history';
  public createRoomUrl = 'http://localhost:3000/api/createRoom'
  public getAllRoomsUrl = 'http://localhost:3000/api/getAllRooms'

  public isAuthenticated: boolean = false;
  public userEmail: string | null = null; // To store the decoded email
  public userRole: string | null = null;   // To store the decoded role
  private accessToken: string | null = null; // Store the access token

  constructor(private http: HttpClient, private userService: UserService) { }

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
          this.userService.userEmail = this.userEmail;
          // Check for the roles in the correct key
          this.userRole = decodedToken['http://dev-b2f7avjyddz6kpot.us.auth0.comroles']?.[0] || null; // Extract the first role
          this.userService.userRole = this.userRole;
          console.log(this.userRole);

        }
      })
    );
  }

  resetPassword(email: String): Observable<any> {
    const body = { email: email };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.resetPasswordEP, body, { headers, responseType: 'text' });
  }

  registerStaff(staffData: RegisterStaffRequest): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Include token if needed
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.registerStaffEp, staffData, { headers });
  }

  getSpecializedStaff(): Observable<any> {
    return this.http.get<any>(this.allSpecializedStaffEP);
  }

  searchOperationRequests(search: OperationRequestSearch): Observable<any> {
    // Construct the query parameters from the search object
    let params = new HttpParams();

    if (search.patientName) params = params.set('patientName', search.patientName);
    if (search.operationType) params = params.set('operationType', search.operationType);
    if (search.priority) params = params.set('priority', search.priority);
    if (search.status) params = params.set('status', search.status);

    // Set headers for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    // Perform the GET request with query parameters and headers
    return this.http.get<any>(this.listRequestsEP, { headers, params });
  }


  deletePatientByEmail(email: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Set the Authorization header
    });
    return this.http.delete<void>(`${this.deletePatientUrl}/${email}`, { headers });
  }

  deletePatientByEmailAsAdmin(email: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Set the Authorization header
    });
    return this.http.delete<void>(
      `${this.deletePatientProfile}/${email}/delete`, { headers }
    );
  }


  deactivateStaffByIdAsAdmin(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Set the Authorization header
    });

    return this.http.put<void>(`${this.deactivateStaffProfile}/${id}`, {}, { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status === 200) {
          return; // Treat 200 OK as success
        }
        throw new Error('Unexpected response status');
      })
    );
  }




  // Registration method
  registerPatient(patientData: CreatePatientRequest): Observable<any> {
    return this.http.post(this.registerUrl, patientData);
  }

  addOperationType(typeData: CreateOperationTypeRequest) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Include token if required
      'Content-Type': 'application/json'
    });

    return this.http.post(this.addTypeEP, typeData, { headers });
  }


  getOperationTypesNames() {
    return this.http.get<any>(this.getAllTypesNamesEP);
  }

  getSpecsNames() {
    return this.http.get<any>(this.getAllSpecsNamesEP);
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

  updateOperationType(operation: Partial<OperationType>): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    // Build URL dynamically
    const requestUrl = `${this.updateOperationTypeUrl}/${operation.id}`;

    return this.http.put<void>(requestUrl, operation, { headers });
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

  // Registration method as admin
  createPatientAsAdmin(patientData: CreatePatientRequest): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}` // Define o cabeçalho Authorization
    });

    return this.http.post(this.createPatientProfileAsAdmin, patientData, { headers });
  }

  createOperationRequestAsDoctor(request: {
    patientId: number;
    operationTypeId: number;
    priorityId: number;
    deadline: string; // Ensure date format validation if needed
  }): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    // Adjusting responseType to 'text' for plain text responses from the backend
    return this.http.post<string>(this.createOperationRequestUrl, request, {
      headers,
      responseType: 'text' as 'json', // Expecting a plain text response
    });
  }




  updateOperationRequestAsDoctor(
    id: number,
    operationPriorityId?: number,
    deadline?: string
  ): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`

    });

    // Constrói a URL com os parâmetros de consulta dinamicamente
    const params = new URLSearchParams();
    if (operationPriorityId) params.append('operationPriorityId', operationPriorityId.toString());
    if (deadline) params.append('deadline', deadline);


    const requestUrl = `${this.updateOperationRequestDoctor}/${id}?${params.toString()}`;

    // Faz a solicitação PUT para atualizar a operação
    return this.http.put<void>(requestUrl, {}, { headers });
  }
  getAllPriorities(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
    });

    return this.http.get<any>(this.listPrioritiesEP, { headers });
  }

  getAllSpecializations(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
    });
    return this.http.get<any>(this.specsFuncsEP, { headers });
  }

  deleteSpecialization(id: number): Observable<any> {
    const url = `${this.specsFuncsEP}/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
    });
    return this.http.delete<any>(url, { headers });
  }

  createSpecialization(specialization: Specialization): Observable<Specialization> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Authorization header
      'Content-Type': 'application/json' // Content-Type for POST
    });

    // Make a POST request to the API to create a new specialization
    return this.http.post<Specialization>(this.specsFuncsEP, specialization, { headers });

  }

  filterSpecializations(search: SpecializationSearch): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    let params = new HttpParams();
    if (search.specCode) {
      params = params.set('specCode', search.specCode);
    }
    if (search.specDescription) {
      params = params.set('specDescription', search.specDescription);
    }
    if (search.specLongDescription) {
      params = params.set('specLongDescription', search.specLongDescription);
    }

    return this.http.get(`${this.specsFuncsEP}/filter`, {
      headers,
      params,
    });

  }

  updateSpecialization(id: number, specialization: Specialization): Observable<Specialization> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    const url = `${this.specsFuncsEP}/${id}`;

    return this.http.put<Specialization>(url, specialization, { headers }); // Sending the PUT request
  }


  getAllRequests(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
    });

    return this.http.get<any>(this.listAllRequestsEP, { headers });
  }

  getMedicalHistory(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
    });

    return this.http.get<any>(this.getMedicalHistoryEP, { headers ,});
  }
  /**
   * This methods is responsible for sending the request to the Web API
   * @param search according to which the filtering shall be done
   * @returns a list with types matching the filters
   */
  getFilteredOperationTypes(search: OperationTypeSearch): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Set the Authorization header
      'Content-Type': 'application/json',
    });

    let params = new HttpParams();
    if (search.name) params = params.set('name', search.name);
    if (search.specialization) params = params.set('specialization', search.specialization);
    params = params.set('status', search.status);

    return this.http.get<any[]>(this.listTypesEP, { headers, params });
  }
  updatePatientAsAdmin(patient: Patient): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    // Ensure that email is provided
    if (!patient.email) {
      throw new Error('Patient email is required.');
    }

    // Construct query parameters
    const params = new URLSearchParams();
    if (patient.firstName) params.append('firstName', patient.firstName);
    if (patient.lastName) params.append('lastName', patient.lastName);
    if (patient.phone) params.append('phone', patient.phone);
    if (patient.emergencyContact) params.append('emergencyContact', patient.emergencyContact);

    // Only append medicalConditions as individual parameters for each condition (not a single JSON string)
    if (patient.medicalConditions && patient.medicalConditions.length > 0) {
      patient.medicalConditions.forEach(condition => {
        params.append('medicalConditions', condition);
      });
    }

    // Ensure that the URL is correctly formatted:
    const requestUrl = `${this.editPatientProfileAdmin}/${patient.email}?${params.toString()}`;

    console.log("Request URL:", requestUrl);  // Log for debugging

    // Send the PUT request with query parameters and no body (empty object as body)
    return this.http.put<void>(requestUrl, {}, { headers });
  }


  createStaffAsAdmin(request: CreateStaffRequest): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<void>(this.createStaffAdmin, request, { headers });
  }


  updateStaffProfileAsAdmin(staffUpdateRequest: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    specializationId?: number;
    role?: string;
    availabilitySlots?: any[];
  }): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    let queryParams = '';

    if (staffUpdateRequest.firstName) queryParams += `firstName=${encodeURIComponent(staffUpdateRequest.firstName)}`;
    if (staffUpdateRequest.lastName) queryParams += `${queryParams ? '&' : '?'}lastName=${encodeURIComponent(staffUpdateRequest.lastName)}`;
    if (staffUpdateRequest.phone) queryParams += `${queryParams ? '&' : '?'}phone=${encodeURIComponent(staffUpdateRequest.phone)}`;
    if (staffUpdateRequest.specializationId != null) queryParams += `${queryParams ? '&' : '?'}specializationId=${staffUpdateRequest.specializationId}`;
    if (staffUpdateRequest.role) queryParams += `${queryParams ? '&' : '?'}role=${encodeURIComponent(staffUpdateRequest.role)}`;
    if (staffUpdateRequest.availabilitySlots) queryParams += `${queryParams ? '&' : '?'}availabilitySlots=${encodeURIComponent(JSON.stringify(staffUpdateRequest.availabilitySlots))}`;

    const url = `${this.editStaffAdmin}/${staffUpdateRequest.email}?${queryParams.toString()}`;

    return this.http.put<void>(url, queryParams, { headers });
  }


  deleteOperationRequestAsDoctor(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.deleteOperationDoctor}${id}`;

    return this.http.delete<void>(url, { headers });
  }

  deactivateOperationTypeAsAdmin(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.removeOPerationType}/${id}`;

    return this.http.delete<void>(url, { headers });
  }


  getPatientEmails(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:5174/api/Patients/emails`);
  }

  getPatientByEmail(email: string): Observable<Patient> {
    const url = `http://localhost:5174/api/Patients/email/${encodeURIComponent(email)}`;
    return this.http.get<Patient>(url);
  }

  getStaffEmails(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:5174/api/StaffUser/all-staff-emails');
  }

  getStaffByEmail(email: string): Observable<Staff> {
    const url = `http://localhost:5174/api/StaffUser/staff-by-email/${encodeURIComponent(email)}`;
    return this.http.get<Staff>(url);

  }

  getActiveTypes(): Observable<OperationType[]> {
    const url = ' http://localhost:5174/api/OperationType/active';
    return this.http.get<OperationType[]>(url);
  }

  searchStaffProfiles(
    name?: string,
    email?: string,
    specialization?: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`  // Set the Authorization header
    });

    // Construct the URL with query parameters
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    if (specialization) params.append('specialization', specialization.toString());
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    // Log the final URL for debugging
    const url = `${this.searchStaffProfilesUrl}?${params.toString()}`;
    console.log('Final search URL:', url);  // Log the full URL for inspection


    return this.http.get<any>(url, { headers });
  }

  createAllergies(name: string, code: string, codeSystem: string, description: string): Observable<any> {
    const allergyData = {
      name: name,
      code: code,
      codeSystem: codeSystem,
      description: description,
    };

    return this.http.post<any>(this.createAllergy, allergyData, {});
  }

  getAllPatientsInfo(): Observable<any> {
    return this.http.get<any>(this.getAllPatients, {});
  }
  getAllergies(): Observable<any> {
    return this.http.get<any>(this.getAllAllergies, {});
  }

  createMedicalCondition(
    code: string,
    codeSystem: string,
    designation: string,
    description: string,
    commonSymptoms: string[]
  ): Observable<any> {
    const medicalConditionData = {
      code: code,
      codeSystem: codeSystem,
      designation: designation,
      description: description,
      commonSymptoms: commonSymptoms
    };

    return this.http.post<any>(this.createMedicalConditon, medicalConditionData, {});
  }

  getMedicalConditions(): Observable<any> {
    return this.http.get<any>(this.getAllMedicalConditions, {});
  }

  createRoom(
    name: string,
    type: string,
    capacity: number,
    location: string
  ): Observable<any> {
    const roomData = {
      name: name,
      type: type,
      capacity: capacity,
      location: location
    };
  
    return this.http.post<any>(this.createRoomUrl, roomData, {});
  }

  getAllRooms(): Observable<any> {
    return this.http.get<any>(this.getAllRoomsUrl, {});
  }
  


}
