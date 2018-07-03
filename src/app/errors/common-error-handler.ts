import {ErrorHandler} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import AccessDeniedError from './access-denied-error';
import DataNotFoundError from './data-not-found-error';
import ConflictDataError from './conflict-data-error';
import IncorrectPasswordError from './incorrect-password-error';
import NoDataError from './no-data-error';
import {Observable} from 'rxjs/Observable';
import ErrorInfo from '../models/ErrorInfo';

export default class CommonErrorHandler implements ErrorHandler {

  errorInfo: ErrorInfo;

  handleError(appError: HttpErrorResponse): void {

    // if (appError instanceof DataNotFoundError) {
    //   alert(appError.error.message);
    // } else if (appError instanceof AccessDeniedError) {
    //   alert(appError.error.message);
    // } else if (appError instanceof ConflictDataError) {
    //   alert(appError.error.message);
    // } else if (appError instanceof IncorrectPasswordError) {
    //   alert(appError.error.message);
    // } else if (appError instanceof NoDataError) {
    //   alert(appError.error.message);
    // } else {
    //   alert(appError.message);
    // }

    switch (appError.status) {
      case 404:
        this.errorInfo = <DataNotFoundError> appError.error;
        alert(this.errorInfo.message);
        break;
      case 401:
        this.errorInfo = <AccessDeniedError> appError.error;
        alert(this.errorInfo.message);
        break;
      default:
        alert(appError.message);
    }

  }

}
