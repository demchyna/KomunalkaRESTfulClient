import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs/Observable';
import Category from '../models/Category';

@Injectable()
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getCategoryById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/category/id/' + id,
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  getAllCategories(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/category/all',
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  createCategory(category: Category): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/category/create',
      JSON.stringify(category),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  updateCategory(category: Category): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/category/update',
      JSON.stringify(category),
      { headers: requestHeaders, observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(
      REST_API_URL + '/api/category/' + id + '/delete',
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }
}