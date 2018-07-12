import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/category/all',
      { observe: 'response' }
    ).catch((error: HttpErrorResponse) => {
      return Observable.throw(new AppError(error));
    });
  }
}
