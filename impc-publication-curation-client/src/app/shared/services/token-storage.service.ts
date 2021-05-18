import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorage {
  constructor() {}

  signOut() {
    window.sessionStorage.removeItem(environment.tokenKey);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(environment.tokenKey);
    window.sessionStorage.setItem(environment.tokenKey, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(environment.tokenKey);
  }
}
