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

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  user: User = new User();

  constructor(private userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.userService.getUserById(params['id'])
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
    this.userService.deleteUser(userId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
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
}
