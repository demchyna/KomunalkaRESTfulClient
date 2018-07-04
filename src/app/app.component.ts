import { Component } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpResponse} from '@angular/common/http';
import {UserService} from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Komunalka';

  constructor(private authService: AuthService, private userService: UserService) {}
}
