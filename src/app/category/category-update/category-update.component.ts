import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Category from '../../models/Category';
import {CategoryService} from '../category.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {

  category: Category = new Category();
  private categoryId: number;

  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => this.categoryId = params['id']);

  }

  ngOnInit() {
    this.categoryService.getCategoryById(this.categoryId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.category = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateCategory(data: any): void {

    this.category.name = data.name;
    this.category.description = data.description;

    this.categoryService.updateCategory(this.category)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/category/all']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
