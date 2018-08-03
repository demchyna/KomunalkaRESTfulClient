import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {E404PageComponent} from './errors/404-page/404-page.component';
import {UserInfoComponent} from './user/user-info/user-info.component';
import {UserUpdateComponent} from './user/user-update/user-update.component';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {CategoriesListComponent} from './category/categories-list/categories-list.component';
import {MeterIndicatorsInfoComponent} from './meter/meter-indicators-info/meter-indicators-info.component';
import {IndicatorCreateComponent} from './indicator/indicator-create/indicator-create.component';
import {IndicatorUpdateComponent} from './indicator/indicator-update/indicator-update.component';
import {IndicatorInfoComponent} from './indicator/indicator-info/indicator-info.component';
import {CategoryCreateComponent} from './category/category-create/category-create.component';
import {CategoryUpdateComponent} from './category/category-update/category-update.component';
import {MeterCreateComponent} from './meter/meter-create/meter-create.component';
import {MeterInfoComponent} from './meter/meter-info/meter-info.component';
import {MeterUpdateComponent} from './meter/meter-update/meter-update.component';
import {TariffCreateComponent} from './tariff/tariff-create/tariff-create.component';
import {CategoryTariffsInfoComponent} from './category/category-tariffs-info/category-tariffs-info.component';
import {TariffInfoComponent} from './tariff/tariff-info/tariff-info.component';
import {TariffUpdateComponent} from './tariff/tariff-update/tariff-update.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    redirectTo: 'login'
  },
  {
    path: 'registration',
    component: UserCreateComponent
  },
  {
    path: 'user/all',
    component: UsersListComponent
  },
  {
    path: 'user/:id/info',
    component: UserInfoComponent
  },
  {
    path: 'meter/create/category/:id',
    component: MeterCreateComponent
  },
  {
    path: 'meter/:id/indicators/info',
    component: MeterIndicatorsInfoComponent
  },
  {
    path: 'meter/:id/info',
    component: MeterInfoComponent
  },
  {
    path: 'meter/:id/update',
    component: MeterUpdateComponent
  },
  {
    path: 'tariff/create/category/:id',
    component: TariffCreateComponent
  },
  {
    path: 'tariff/:id/info',
    component: TariffInfoComponent
  },
  {
    path: 'tariff/:id/update',
    component: TariffUpdateComponent
  },
  {
    path: 'user/:id/update',
    component: UserUpdateComponent
  },
  {
    path: 'category/all',
    component: CategoriesListComponent,
  },
  {
    path: 'category/:id/tariffs/info',
    component: CategoryTariffsInfoComponent
  },
  {
    path: 'category/create',
    component: CategoryCreateComponent
  },
  {
    path: 'category/:id/update',
    component: CategoryUpdateComponent
  },
  {
    path: 'indicator/create/meter/:id',
    component: IndicatorCreateComponent
  },
  {
    path: 'indicator/:id/info',
    component: IndicatorInfoComponent
  },
  {
    path: 'indicator/:id/update',
    component: IndicatorUpdateComponent
  },
  {
    path: '**',
    component: E404PageComponent
  }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
