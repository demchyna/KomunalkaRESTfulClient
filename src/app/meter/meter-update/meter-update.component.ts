import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {MeterService} from '../meter.service';
import {CategoryService} from '../../category/category.service';
import {UnitService} from '../../unit/unit.service';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import Meter from '../../models/Meter';
import Unit from '../../models/Unit';
import Category from '../../models/Category';

@Component({
  selector: 'app-meter-update',
  templateUrl: './meter-update.component.html',
  styleUrls: ['./meter-update.component.css']
})
export class MeterUpdateComponent implements OnInit {

  meterId: number;
  meter: Meter = new Meter();
  units: Unit[] = [];
  currentUnitId: number;
  category: Category = new Category();
  categories: Category[] = [];
  currentCategoryId: number;

  constructor(private meterService: MeterService,
              private categoryService: CategoryService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe( params => this.meterId = params['id']);
  }

  ngOnInit() {
    this.meterService.getMeterById(this.meterId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.meter = response.body;

          this.categoryService.getCategoryById(this.meter.category.id)
            .subscribe((categoryResp: HttpResponse<any>) => {
              if (categoryResp) {
                tokenSetter(categoryResp);
                this.category = categoryResp.body;
              }
            }, (appError: AppError) => {
              throw appError;
            });

          this.unitService.getAllUnits()
            .subscribe((unitResp: HttpResponse<any>) => {
              if (unitResp) {
                this.units = unitResp.body;
                this.units.map((unit, index) => {
                  if (unit.id === this.meter.unit.id) {
                    this.currentUnitId = index;
                  }
                });
              }
            }, (appError: AppError) => {
              throw appError;
            });

          this.categoryService.getAllCategories()
            .subscribe((categoryResp: HttpResponse<any>) => {
              if (categoryResp) {
                this.categories = categoryResp.body;
                this.categories.map((category, index) => {
                  if (category.id === this.meter.category.id) {
                    this.currentCategoryId = index;
                  }
                });
              }
            }, (appError: AppError) => {
              throw appError;
            });

        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateMeter(data: any): void {

    this.meter.name = data.name;
    this.meter.category = data.category;
    this.meter.unit = data.unit;
    this.meter.description = data.description;

    this.meterService.updateMeter(this.meter)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/meter/' + this.meterId + '/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
