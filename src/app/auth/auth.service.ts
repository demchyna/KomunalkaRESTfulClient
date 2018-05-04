import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {JwtHelperService} from '@auth0/angular-jwt';
import User from '../models/User';
import DataNotFoundError from '../errors/data-not-found-error';
import IncorrectPasswordError from '../errors/incorrect-password-error';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService ) {
  }

  login(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
        REST_API_URL + '/login',
        JSON.stringify(user),
        { headers: requestHeaders, observe: 'response' }
      ).catch((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return Observable.throw(new DataNotFoundError(error));
        } else if (error.status === 401) {
          return Observable.throw(new IncorrectPasswordError(error));
        }
        return Observable.throw(new AppError(error));
    });
  }

  logout(): void {
    sessionStorage.removeItem('jwt-token');
  }

  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

}
