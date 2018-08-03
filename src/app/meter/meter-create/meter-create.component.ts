import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {MeterService} from '../meter.service';
import {TariffService} from '../../tariff/tariff.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitService} from '../../unit/unit.service';
import Unit from '../../models/Unit';
import {CategoryService} from '../../category/category.service';
import Category from '../../models/Category';
import Meter from '../../models/Meter';
import {UserService} from '../../user/user.service';

@Component({
  selector: 'app-meter-create',
  templateUrl: './meter-create.component.html',
  styleUrls: ['./meter-create.component.css']
})
export class MeterCreateComponent implements OnInit {

  category: Category = new Category();
  units: Unit[] = [];

  constructor(private meterService: MeterService,
              private categoryService: CategoryService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe( params => {
      this.categoryService.getCategoryById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.category = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });

    this.unitService.getAllUnits()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.units = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  createMeter(data: any): void {
    const meter = new Meter();

    meter.name = data.name;
    meter.category = this.category;
    meter.unit = data.unit;
    meter.user = this.userService.currentUser;
    meter.description = data.description;

    this.meterService.createMeter(meter)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/all']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }
}
