import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import DataNotFoundError from '../errors/data-not-found-error';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import User from '../models/User';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/user/all',
      { observe: 'response' }
      ).catch((error: HttpErrorResponse) => {
      if (error.status === 404) {
        return Observable.throw(new DataNotFoundError(error));
      }
      return Observable.throw(new AppError(error));
    });
  }
}
