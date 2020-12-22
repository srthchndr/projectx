import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppConstant } from 'src/app/shared/constants/app.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  jwtHelper: any;

  constructor(private http: HttpClient, private tokenService: TokenService) { 
    this.jwtHelper = new JwtHelperService();
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${AppConstant.apiBaseURL}/api/auth`, {username: 'user', password: 'password'})
      .pipe(
        map(result => {
          console.log(result);
          this.tokenService.storeTokens(result);
          //localStorage.setItem('auth_token', result.auth_token);
          return true;
        })
      );
  }

  refreshToken() {
    return this.http.post<any>(`${AppConstant.apiBaseURL}/refresh`, {
      'refreshToken': this.tokenService.getRefreshToken()
    });
  }

  isUserAuthenticated(): boolean {
    let token = this.tokenService.getAuthToken();

    let isTokenExpired = this.jwtHelper.isTokenExpired(token);

    return !isTokenExpired;
  }

}
