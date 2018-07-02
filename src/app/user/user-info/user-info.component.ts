import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import AccessDeniedError from '../../errors/access-denied-error';
import DataNotFoundError from '../../errors/data-not-found-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  user: User = new User();
  private userId: number;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => this.userId = params['id']);
  }

  ngOnInit() {
    this.userService.getUserById(this.userId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.user  = response.body;
        }
      }, (appError: AppError) => {
        if (appError instanceof DataNotFoundError) {
          alert(appError.error.message);
        } else if (appError instanceof AccessDeniedError) {
          alert(appError.error.message);
        } else {
          throw appError;
        }
      });
  }

  editUser(userId: number) {
    this.router.navigate(['/user/' + userId + '/update']);
  }

  deleteUser(userId: number) {

  }

}
