import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpResponse} from '@angular/common/http';
import {UserService} from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Komunalka App';

  navbarOpen = false;

  constructor(public authService: AuthService, public userService: UserService) {}

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
