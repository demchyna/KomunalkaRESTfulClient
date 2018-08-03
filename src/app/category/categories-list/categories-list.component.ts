import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {NavigationEnd, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import Category from '../../models/Category';
import {MeterService} from '../../meter/meter.service';
import {UserService} from '../../user/user.service';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit {

  categories: Category[];

  constructor(private categoryService: CategoryService,
              private meterService: MeterService,
              private userService: UserService,
              private router: Router) {  }

  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.categories = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  addCategory() {
    this.router.navigate(['category/create']);
  }

  editCategory(categoryId: number) {
    this.router.navigate(['/category/' + categoryId + '/update']);
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.ngOnInit();
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  addMeter(categoryId: number) {
    this.router.navigate(['meter/create/category/' + categoryId]);
  }

  addTariff(categoryId: number) {
    this.router.navigate(['tariff/create/category/' + categoryId]);
  }

  tariffsList(categoryId: number) {
    this.router.navigate(['category/' + categoryId + '/tariffs/info']);
  }
}
