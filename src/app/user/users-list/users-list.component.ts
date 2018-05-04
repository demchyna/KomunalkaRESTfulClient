import {Component, OnChanges, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import DataNotFoundError from '../../errors/data-not-found-error';
import User from '../../models/User';
import {tokenSetter} from '../../helpers/http-request-helper';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getAllUsers()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.users = response.body;
        }
      }, (appError: AppError) => {
        if (appError instanceof DataNotFoundError) {
          alert(appError.message);
        } else {
          throw appError;
        }
      });
  }

  selectedRow(user: User) {
    this.router.navigate(['/user/' + user.id + '/info']);
  }

}
