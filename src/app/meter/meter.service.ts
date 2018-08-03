import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs/Observable';
import Meter from '../models/Meter';

@Injectable()
export class MeterService {

  constructor(private httpClient: HttpClient) { }

  getMeterByCategoryIdAndUserId(categoryId: number, userId: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/meter/category/' + categoryId + '/user/' + userId,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getMeterById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/meter/id/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  createMeter(meter: Meter): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/meter/create',
      JSON.stringify(meter),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  updateMeter(meter: Meter): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/meter/update',
      JSON.stringify(meter),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  deleteMeter(id: number): Observable<any> {
    return this.httpClient.delete<any>(
      REST_API_URL + '/api/meter/' + id + '/delete',
      {observe: 'response'}
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }
}
