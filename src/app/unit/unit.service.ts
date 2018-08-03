import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {REST_API_URL} from '../helpers/http-request-helper';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';

@Injectable()
export class UnitService {

  constructor(private httpClient: HttpClient) { }

  getUnitById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/unit/id/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getAllUnits(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/unit/all',
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

}
