import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import AppError from '../../errors/app-error';
import DataNotFoundError from '../../errors/data-not-found-error';
import IncorrectPasswordError from '../../errors/incorrect-password-error';
import User from '../../models/User';
import {tokenSetter} from '../../helpers/http-request-helper';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {  }

  signIn(data: any): void {
    const user = new User;
    user.username = data.username;
    user.password = data.password;

    this.loginSubscription = this.authService.login(user)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/']);
        }
      }, (appError: AppError) => {
          throw appError;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
