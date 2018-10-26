import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../category.service';
import {UserService} from '../../user/user.service';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import Category from '../../models/Category';

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.css']
})
export class CategoryInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteCategorySubscription: Subscription;

  category: Category = new Category();

  constructor(private categoryService: CategoryService,
              public userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.getCategoryByIdSubscription = this.categoryService.getCategoryById(params['id'])
        .subscribe((categoryResp: HttpResponse<any>) => {
          if (categoryResp) {
            tokenSetter(categoryResp);
            this.category = categoryResp.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
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
                this.router.navigate(['/category/user/' + this.userService.currentUser.id]);
              }
            }, (appError: AppError) => {
              throw appError;
            });
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
  }

}
