import {Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import AccessDeniedError from '../../errors/access-denied-error';
import DataNotFoundError from '../../errors/data-not-found-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {

  paramsUserSubscription: Subscription;
  getUserByIdUserSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  deleteUserUserSubscription: Subscription;

  user: User = new User();

  constructor(protected userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {  }

  ngOnInit() {
    this.paramsUserSubscription = this.route.params.subscribe( params => {
      this.getUserByIdUserSubscription = this.userService.getUserById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.user  = response.body;
            this.user.create_date = (new Date(response.body.create_date)).toLocaleString();
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  editUser(userId: number) {
    this.router.navigate(['/user/' + userId + '/update']);
  }

  deleteUser(userId: number) {

    this.getUserByIdSubscription = this.userService.getUserById(userId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const user = response.body;

          this.deleteUserUserSubscription = this.userService.deleteUser(user)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                if (this.userService.currentUser.id === userId) {
                  this.authService.logout();
                  this.router.navigate(['/login']);
                } else {
                  this.router.navigate(['/user/all']);
                }
              }
            }, (appError: AppError) => {
              throw appError;
            });

        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  categoriesList(userId: number) {
    this.router.navigate(['category/user/' + userId]);
  }

  ngOnDestroy(): void {
    if (this.paramsUserSubscription) {
      this.paramsUserSubscription.unsubscribe();
    }
    if (this.getUserByIdUserSubscription) {
      this.getUserByIdUserSubscription.unsubscribe();
    }
    if (this.getUserByIdSubscription) {
      this.getUserByIdSubscription.unsubscribe();
    }
    if (this.deleteUserUserSubscription) {
      this.deleteUserUserSubscription.unsubscribe();
    }
  }
}
