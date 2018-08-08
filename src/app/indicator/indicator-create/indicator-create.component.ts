import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import Indicator from '../../models/Indicator';
import {IndicatorService} from '../indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import Meter from '../../models/Meter';
import {tokenSetter} from '../../helpers/http-request-helper';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import Tariff from '../../models/Tariff';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-indicator-create',
  templateUrl: './indicator-create.component.html',
  styleUrls: ['./indicator-create.component.css']
})
export class IndicatorCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  getTariffByCategoryIdSubscription: Subscription;
  getLastAddedIndicatorByMeterIdSubscription: Subscription;
  createIndicatorSubscription: Subscription;

  meter: Meter = new Meter();
  tariffs: Tariff[];
  lastIndicator: Indicator = new Indicator();

  constructor(
    private indicatorService: IndicatorService,
    private meterService: MeterService,
    private tariffService: TariffService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getMeterByIdSubscription = this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter = response.body;

            this.getTariffByCategoryIdSubscription = this.tariffService.getTariffByCategoryId(this.meter.category.id)
              .subscribe((resp: HttpResponse<any>) => {
                if (resp) {
                  this.tariffs = resp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

          }
        }, (appError: AppError) => {
          throw appError;
        });

      this.getLastAddedIndicatorByMeterIdSubscription = this.indicatorService.getLastAddedIndicatorByMeterId(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.lastIndicator = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });

    });
  }

  createIndicator(data: any): void {
    const indicator = new Indicator();

    indicator.current = data.current;
    indicator.date = data.date;
    indicator.status = data.status;
    if (this.lastIndicator) {
      indicator.previousId = this.lastIndicator.id;
    }
    indicator.meterId = this.meter.id;
    indicator.tariffId = data.tariff.id;
    indicator.description = data.description;

    this.createIndicatorSubscription = this.indicatorService.createIndicator(indicator)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/meter/' + indicator.meterId + '/indicators/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.getTariffByCategoryIdSubscription) {
      this.getTariffByCategoryIdSubscription.unsubscribe();
    }
    if (this.getLastAddedIndicatorByMeterIdSubscription) {
      this.getLastAddedIndicatorByMeterIdSubscription.unsubscribe();
    }
    if (this.createIndicatorSubscription) {
      this.createIndicatorSubscription.unsubscribe();
    }
  }
}
