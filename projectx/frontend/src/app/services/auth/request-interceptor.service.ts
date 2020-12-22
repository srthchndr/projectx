import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { AuthenticationService } from './authentication.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService, private authService: AuthenticationService) { }

  isRefreshToken: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.tokenService.getAuthToken();

    if(token) {
      req = this.AddAuthHeader(req, token);
    }
    else {
      req = req.clone({
        headers : new HttpHeaders({
          "Content-Type": "application/json; charset=UTF-8",
          "Accept" : "application/json; charset=UTF-8"
        })
      });
    }

    return <any>next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if(error.status === 401) {
            return this.handle401Error(req, next);
          }
        }
        return throwError(error);
      })
    )
  }

  private AddAuthHeader(req: HttpRequest<any>, token: string) {
    let updatedReq = req.clone({
      headers : new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8",
        "Accept" : "application/json; charset=UTF-8",
        "Authorization" : `Bearer ${token}`
      })
    });
    return updatedReq;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshToken) {
      this.isRefreshToken = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(switchMap((response: any) => {        
        let token = response["auth_token"];
        this.tokenService.storeTokens(response);
        if(token) {
          this.refreshTokenSubject.next(token);
          return next.handle(this.AddAuthHeader(req, token));
        }

        return this.logoutUser();

      }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.AddAuthHeader(req, token));
        }));
    }
  }

  private logoutUser() {
    this.tokenService.removeTokens();

    return throwError('');    
  }
}
