import {ErrorHandler, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import AccessDeniedError from './access-denied-error';
import DataNotFoundError from './data-not-found-error';
import ErrorInfo from '../models/ErrorInfo';
import {Router} from '@angular/router';
import InvalidDataError from './invalid-data-error';
import ValidationError from '../models/ValidationError';
import ForbiddenError from './forbidden-error';

@Injectable()
export default class CommonErrorHandler implements ErrorHandler {

  errorInfo: ErrorInfo;

  constructor(private injector: Injector) {  }

  handleError(appError: HttpErrorResponse): void {

    const router = this.injector.get(Router);

    switch (appError.status) {
      case 404:
        this.errorInfo = <DataNotFoundError> appError.error;
        // alert(this.errorInfo.message);
        router.navigate(['/not-found']);
        break;
      case 403:
        this.errorInfo = <AccessDeniedError> appError.error;
        router.navigate(['/no-access']);
        break;
      case 401:
        this.errorInfo = <ForbiddenError> appError.error;
        alert(this.errorInfo.message);
        break;
      default:
        alert(appError.message);
    }
  }
}
