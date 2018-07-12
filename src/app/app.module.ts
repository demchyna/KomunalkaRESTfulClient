import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {E404PageComponent} from './errors/404-page/404-page.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {UserInfoComponent} from './user/user-info/user-info.component';
import {UserUpdateComponent} from './user/user-update/user-update.component';
import {appRouting} from './app.routing';
import CommonErrorHandler from './errors/common-error-handler';
import {AuthService} from './auth/auth.service';
import {UserService} from './user/user.service';
import {RoleService} from './role/role.service';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { CategoriesListComponent } from './category/categories-list/categories-list.component';
import {CategoryService} from './category/category.service';
import {MeterService} from './meter/meter.service';
import { MetersListComponent } from './meter/meters-list/meters-list.component';
import { MeterInfoComponent } from './meter/meter-info/meter-info.component';
import { IndicatorsListComponent } from './indicator/indicators-list/indicators-list.component';
import {IndicatorService} from './indicator/indicator.service';
import { IndicatorCreateComponent } from './indicator/indicator-create/indicator-create.component';

export function tokenGetter() {
  return sessionStorage.getItem('jwt-token');
}

@NgModule({
  declarations: [
    AppComponent,
    E404PageComponent,
    HomeComponent,
    LoginComponent,
    UsersListComponent,
    UserInfoComponent,
    UserUpdateComponent,
    UserCreateComponent,
    CategoriesListComponent,
    MetersListComponent,
    MeterInfoComponent,
    IndicatorsListComponent,
    IndicatorCreateComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: [''],
        skipWhenExpired: true
      }
    }),
    FormsModule,
    appRouting
  ],
  providers: [
    { provide: ErrorHandler, useClass: CommonErrorHandler },
    AuthService,
    UserService,
    RoleService,
    CategoryService,
    MeterService,
    IndicatorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
