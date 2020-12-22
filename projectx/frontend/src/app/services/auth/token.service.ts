import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly AUTH_TOKEN = 'auth_token';
  private readonly REFRESH_TOKEN = 'refresh_token';

  constructor() { }

  getAuthToken(): string {
    let authToken = localStorage.getItem('auth_token');

    if(authToken) {
      return authToken;
    }

    return null;
  }

  getRefreshToken(): string {
    let refreshToken = localStorage.getItem('refresh_token');
    console.log(refreshToken);
    if(refreshToken) {
      return refreshToken;
    }

    return null;
  }

  storeTokens(data: any): void {
    localStorage.setItem(this.AUTH_TOKEN, data["auth_token"]);
    localStorage.setItem(this.REFRESH_TOKEN, data["refresh_token"]);
  }

  removeTokens(): void {
    localStorage.removeItem(this.AUTH_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
