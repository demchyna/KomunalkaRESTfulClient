import { Component, OnInit } from '@angular/core';
import User from '../../models/User';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService} from '../../role/role.service';
import {UserService} from '../user.service';
import Role from '../../models/Role';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  constructor(private userService: UserService, private roleService: RoleService, private route: ActivatedRoute, private router: Router) { }

  registerUser(data: any): void {
    const user = new User;

    if (data.password === data.confirm) {
      user.password = data.password;
    } else {
      this.router.navigate(['registration']);
      return;
    }

    user.username = data.username;
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.email = data.email;
    user.description = data.description;
    user.authorities = [];

    this.userService.createUser(user)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['login']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnInit() {
  }

}