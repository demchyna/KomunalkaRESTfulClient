import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs/Observable';
import Indicator from '../models/Indicator';

@Injectable()
export class IndicatorService {

  constructor(private httpClient: HttpClient) { }

  getIndicatorById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/id/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getIndicatorByMeterId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/meter/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  createIndicator(indicator: Indicator): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/indicator/create',
      JSON.stringify(indicator),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getLastAddedIndicatorByMeterId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/last/meter/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  updateIndicator(indicator: Indicator): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/indicator/update',
      JSON.stringify(indicator),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  deleteIndicator(id: number): Observable<any> {
    return this.httpClient.delete<any>(
      REST_API_URL + '/api/indicator/' + id + '/delete',
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

}
