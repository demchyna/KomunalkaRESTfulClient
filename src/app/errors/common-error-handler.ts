import {ErrorHandler} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

export default class CommonErrorHandler implements ErrorHandler {

  handleError(error: HttpErrorResponse): void {
    alert(error.message);
  }

}
