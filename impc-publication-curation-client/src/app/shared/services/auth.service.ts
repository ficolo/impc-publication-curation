import { TokenStorage } from './token-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {
  loggedIn = false;
  loggedOut: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  login(user: any) {
    return this.http
      .post(environment.authUrl, user)
      .toPromise()
      .then((data: any) => {
        this.tokenStorage.saveToken(data.token);
        this.loggedIn = true;
      });
  }

  isLoggedIn() {
    return !!this.tokenStorage.getToken();
  }

  logout() {
    this.tokenStorage.signOut();
    this.loggedOut.emit(false);
  }
}

interface TokenResponse {
  token: any;
}
