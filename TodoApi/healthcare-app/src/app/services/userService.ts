import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userEmail: string | null = null;
  private _userRole: string | null = null;
  private _accessToken: string | null = null; // Store the access token

  set userEmail(email: string | null) {
    this._userEmail = email;
  }

  get userEmail(): string | null {
    return this._userEmail;
  }

  set userRole(role: string | null) {
    this._userRole = role;
  }

  get userRole(): string | null {
    return this._userRole;
  }

  set accessToken(token: string | null) {
    this._accessToken = token;
  }

  get accessToken(): string | null {
    return this._accessToken;
  }
}
