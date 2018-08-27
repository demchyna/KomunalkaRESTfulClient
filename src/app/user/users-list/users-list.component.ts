import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import {tokenSetter} from '../../helpers/http-request-helper';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../auth/auth.service';
import {OrderPipe} from 'ngx-order-pipe';

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
  firstNameValue = '';
  lastNameValue = '';
  usernameValue = '';
  emailValue = '';
  order = 'id';
  reverse = false;
  currentPage = 1;
  itemsNumber = 10;
  maxIntegerValue = Number.MAX_SAFE_INTEGER;
  sortedUsers: User[] = [];

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private orderPipe: OrderPipe) {
    this.sortedUsers = this.orderPipe.transform(this.users, 'id');
  }

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

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  clickEvent($event) {
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.getAllUsersUserSubscription) {
      this.getAllUsersUserSubscription.unsubscribe();
    }
  }
}
