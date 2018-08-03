import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {CategoryService} from '../../category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import Category from '../../models/Category';
import Tariff from '../../models/Tariff';
import {TariffService} from '../tariff.service';
import {UnitService} from '../../unit/unit.service';
import Unit from '../../models/Unit';

@Component({
  selector: 'app-tariff-create',
  templateUrl: './tariff-create.component.html',
  styleUrls: ['./tariff-create.component.css']
})
export class TariffCreateComponent implements OnInit {

  category: Category = new Category();
  units: Unit[] = [];

  constructor(private categoryService: CategoryService,
              private tariffService: TariffService,
              private unitService: UnitService,
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

  createTariff(data: any): void {
    const tariff = new Tariff();

    tariff.name = data.name;
    tariff.rate = data.rate;
    tariff.currency = data.currency;
    tariff.begin_date = data.begin_date;
    if (data.end_date) {
      tariff.end_date = data.end_date;
    }
    tariff.description = data.description;
    tariff.category = this.category;
    tariff.unit = data.unit;

    this.tariffService.createTariff(tariff)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/all']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
