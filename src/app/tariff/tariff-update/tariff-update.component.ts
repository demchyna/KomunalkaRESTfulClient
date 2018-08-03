import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../category/category.service';
import {TariffService} from '../tariff.service';
import {UnitService} from '../../unit/unit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Tariff from '../../models/Tariff';
import Unit from '../../models/Unit';

@Component({
  selector: 'app-tariff-update',
  templateUrl: './tariff-update.component.html',
  styleUrls: ['./tariff-update.component.css']
})
export class TariffUpdateComponent implements OnInit {

  tariffId: number;
  tariff: Tariff = new Tariff();
  units: Unit[] = [];
  currentUnitId: number;

  constructor(private categoryService: CategoryService,
              private tariffService: TariffService,
              private unitService: UnitService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe( params => this.tariffId = params['id']);
  }

  ngOnInit() {
    this.tariffService.getTariffById(this.tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.tariff = response.body;

          this.unitService.getAllUnits()
            .subscribe((unitResp: HttpResponse<any>) => {
              if (unitResp) {
                this.units = unitResp.body;

                this.units.map((unit, index) => {
                  if (unit.id === this.tariff.unit.id) {
                    this.currentUnitId = index;
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

  updateTariff(data: any): void {

    this.tariff.name = data.name;
    this.tariff.rate = data.rate;
    this.tariff.currency = data.currency;
    this.tariff.begin_date = data.begin_date;
    if (data.end_date) {
      this.tariff.end_date = data.end_date;
    }
    this.tariff.description = data.description;
    this.tariff.unit = data.unit;

    this.tariffService.updateTariff(this.tariff)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/tariff/' + this.tariffId + '/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
