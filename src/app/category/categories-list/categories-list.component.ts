import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import Category from '../../models/Category';
import {MeterService} from '../../meter/meter.service';
import {UserService} from '../../user/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getCategoryByUserIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteCategorySubscription: Subscription;

  categories: Category[] = [];

  constructor(private categoryService: CategoryService,
              private meterService: MeterService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getCategoryByUserIdSubscription = this.categoryService.getCategoryByUserId(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.categories = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  addCategory() {
    this.router.navigate(['category/create']);
  }

  editCategory(categoryId: number) {
    this.router.navigate(['/category/' + categoryId + '/update']);
  }

  deleteCategory(categoryId: number) {
    this.getCategoryByIdSubscription = this.categoryService.getCategoryById(categoryId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const category = response.body;

          this.deleteCategorySubscription = this.categoryService.deleteCategory(category)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                this.ngOnInit();
              }
            }, (appError: AppError) => {
              throw appError;
            });

        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  addMeter(categoryId: number) {
    this.router.navigate(['meter/create/category/' + categoryId]);
  }

  tariffsList(categoryId: number) {
    this.router.navigate(['category/' + categoryId + '/tariffs/info']);
  }

  changeCollapseStatus(element, categoryName) {
    if ((element.classList.contains('collapsed'))) {
      element.textContent = '&dtrif;' + categoryName;
    } else {
      element.textContent = '▸' + categoryName;
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByUserIdSubscription) {
      this.getCategoryByUserIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
  }
}
