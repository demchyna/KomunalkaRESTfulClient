import {HttpErrorResponse} from '@angular/common/http';
import ErrorInfo from '../models/ErrorInfo';

export default class AppError extends HttpErrorResponse {
  constructor(error?: any) {
    super(error);
  }
}
