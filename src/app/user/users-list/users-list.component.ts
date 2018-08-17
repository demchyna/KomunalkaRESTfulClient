import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import DataNotFoundError from '../../errors/data-not-found-error';
import User from '../../models/User';
import {tokenSetter} from '../../helpers/http-request-helper';
import {Router} from '@angular/router';
import AccessDeniedError from '../../errors/access-denied-error';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import ValidationError from '../../models/ValidationError';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {

  getAllUsersUserSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  deleteUserUserSubscription: Subscription;

  users: User[];

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getAllUsersUserSubscription = this.userService.getAllUsers()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.users = response.body;
        }
      }, (appError: AppError) => {
          throw appError;
      });
  }

  selectedRow(userId: number) {
    this.router.navigate(['/user/' + userId + '/info']);
  }

  editUser(userId: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['/user/' + userId + '/update']);
  }

  deleteUser(userId: number, $event) {
    $event.stopPropagation();

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

  ngOnDestroy(): void {
    if (this.getAllUsersUserSubscription) {
      this.getAllUsersUserSubscription.unsubscribe();
    }
  }
}
