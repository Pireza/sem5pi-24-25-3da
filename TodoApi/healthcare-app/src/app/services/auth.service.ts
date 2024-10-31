import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:5174/api/Patients/authenticate';
  public isAuthenticated: boolean = false; // Track authentication state

  constructor(private http: HttpClient) {}

  authenticateUser(): Observable<any> {
    return this.http.post(this.apiUrl, {}).pipe(
      tap((response: any) => {
        if (response) {
          this.isAuthenticated = true; // Set authenticated state to true
        }
      })
    );
  }
}
