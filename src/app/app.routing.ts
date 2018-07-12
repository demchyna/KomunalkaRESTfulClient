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
import {MeterInfoComponent} from './meter/meter-info/meter-info.component';
import {IndicatorCreateComponent} from './indicator/indicator-create/indicator-create.component';

const routes: Routes = [
  {
    path: '',
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
    path: 'meter/:id/info',
    component: MeterInfoComponent
  },
  {
    path: 'user/:id/update',
    component: UserUpdateComponent
  },
  {
    path: 'category/all',
    component: CategoriesListComponent
  },
  {
    path: 'indicator/create',
    component: IndicatorCreateComponent
  },
  {
    path: '**',
    component: E404PageComponent
  }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
