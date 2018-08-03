import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Category from '../../models/Category';
import {CategoryService} from '../category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit {

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit() {
  }

  createCategory(data: any): void {
    const category = new Category();

    category.name = data.name;
    category.description = data.description;

    this.categoryService.createCategory(category)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/all']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
