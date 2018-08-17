import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../../category/category.service';
import {TariffService} from '../tariff.service';
import {UnitService} from '../../unit/unit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Tariff from '../../models/Tariff';
import Unit from '../../models/Unit';
import {Subscription} from 'rxjs/Subscription';
import ValidationError from '../../models/ValidationError';

@Component({
  selector: 'app-tariff-update',
  templateUrl: './tariff-update.component.html',
  styleUrls: ['./tariff-update.component.css']
})
export class TariffUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getAllUnitsSubscription: Subscription;
  updateTariffSubscription: Subscription;

  tariffId: number;
  tariff: Tariff = new Tariff();
  units: Unit[] = [];
  currentUnitId: number;
  tariffErrors: Map<string, string> = new Map<string, string>();

  constructor(private categoryService: CategoryService,
              private tariffService: TariffService,
              private unitService: UnitService,
              private route: ActivatedRoute,
              private router: Router) {
    this.paramsSubscription = this.route.params.subscribe( params => this.tariffId = params['id']);
  }

  ngOnInit() {
    this.getTariffByIdSubscription = this.tariffService.getTariffById(this.tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.tariff = response.body;

          this.getAllUnitsSubscription = this.unitService.getAllUnits()
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

    this.updateTariffSubscription = this.tariffService.updateTariff(this.tariff)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/tariff/' + this.tariffId + '/info']);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.tariffErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getAllUnitsSubscription) {
      this.getAllUnitsSubscription.unsubscribe();
    }
    if (this.updateTariffSubscription) {
      this.updateTariffSubscription.unsubscribe();
    }
  }
}
