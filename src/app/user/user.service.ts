import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import DataNotFoundError from '../errors/data-not-found-error';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import AccessDeniedError from '../errors/access-denied-error';
import User from '../models/User';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) { }

  createUser(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/registration',
      JSON.stringify(user),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/user/all',
      { observe: 'response' }
      ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getUserById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/user/id/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  updateUser(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/user/update',
      JSON.stringify(user),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }
}
