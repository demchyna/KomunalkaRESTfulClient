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
import {CommonErrorHandler} from './errors/common-error-handler';
import {AuthService} from './auth/auth.service';
import {UserService} from './user/user.service';
import {RoleService} from './role/role.service';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { CategoriesListComponent } from './category/categories-list/categories-list.component';
import {CategoryService} from './category/category.service';
import {MeterService} from './meter/meter.service';
import { MetersListComponent } from './meter/meters-list/meters-list.component';
import { MeterIndicatorsInfoComponent } from './meter/meter-indicators-info/meter-indicators-info.component';
import { IndicatorsListComponent } from './indicator/indicators-list/indicators-list.component';
import {IndicatorService} from './indicator/indicator.service';
import { IndicatorCreateComponent } from './indicator/indicator-create/indicator-create.component';
import {TariffService} from './tariff/tariff.service';
import { IndicatorUpdateComponent } from './indicator/indicator-update/indicator-update.component';
import { IndicatorInfoComponent } from './indicator/indicator-info/indicator-info.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryUpdateComponent } from './category/category-update/category-update.component';
import { MeterCreateComponent } from './meter/meter-create/meter-create.component';
import { MeterUpdateComponent } from './meter/meter-update/meter-update.component';
import {UnitService} from './unit/unit.service';
import { MeterInfoComponent } from './meter/meter-info/meter-info.component';
import { TariffCreateComponent } from './tariff/tariff-create/tariff-create.component';
import { TariffUpdateComponent } from './tariff/tariff-update/tariff-update.component';
import { TariffInfoComponent } from './tariff/tariff-info/tariff-info.component';
import { TariffsListComponent } from './tariff/tariffs-list/tariffs-list.component';
import { CategoryTariffsInfoComponent } from './category/category-tariffs-info/category-tariffs-info.component';
import {AuthGuardService} from './guards/auth-guard/auth-guard.service';
import {E403PageComponent} from './errors/403-page/403-page.component';
import {AdminGuardService} from './guards/admin-guard/admin-guard.service';
import {OrderModule} from 'ngx-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { SearchFilterPipe } from './helpers/search-filter.pipe';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';

export function tokenGetter() {

  let jwtToken = '';
  if (sessionStorage.getItem('jwt-token')) {
    jwtToken = sessionStorage.getItem('jwt-token').substr(7);
  }
  return jwtToken;
}

@NgModule({
  declarations: [
    AppComponent,
    E404PageComponent,
    E403PageComponent,
    HomeComponent,
    LoginComponent,
    UsersListComponent,
    UserInfoComponent,
    UserUpdateComponent,
    UserCreateComponent,
    CategoriesListComponent,
    MetersListComponent,
    MeterIndicatorsInfoComponent,
    IndicatorsListComponent,
    IndicatorCreateComponent,
    IndicatorUpdateComponent,
    IndicatorInfoComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
    MeterCreateComponent,
    MeterUpdateComponent,
    MeterInfoComponent,
    TariffCreateComponent,
    TariffUpdateComponent,
    TariffInfoComponent,
    TariffsListComponent,
    CategoryTariffsInfoComponent,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,

        // whitelistedDomains: ['localhost:8080'],

        whitelistedDomains: ['thawing-escarpment-35369.herokuapp.com'],

        blacklistedRoutes: [''],
        skipWhenExpired: true
      }
    }),
    FormsModule,
    appRouting,
    OrderModule,
    NgxPaginationModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler, useClass: CommonErrorHandler },
    AuthService,
    UserService,
    RoleService,
    CategoryService,
    MeterService,
    IndicatorService,
    TariffService,
    UnitService,
    AuthGuardService,
    AdminGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
