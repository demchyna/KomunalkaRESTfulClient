import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Category from '../../models/Category';
import {CategoryService} from '../category.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../../user/user.service';
import ValidationError from '../../models/ValidationError';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit, OnDestroy {

  createCategorySubscription: Subscription;

  categoryErrors: Map<string, string> = new Map<string, string>();

  constructor(private categoryService: CategoryService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  createCategory(data: any): void {
    const category = new Category();

    category.name = data.name;
    category.description = data.description;
    category.user = this.userService.currentUser;

    this.createCategorySubscription = this.categoryService.createCategory(category)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/user/' + this.userService.currentUser.id]);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.categoryErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.createCategorySubscription) {
      this.createCategorySubscription.unsubscribe();
    }
  }
}
