import {Component, OnDestroy, OnInit} from '@angular/core';
import Indicator from '../../models/Indicator';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Tariff from '../../models/Tariff';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import {IndicatorService} from '../indicator.service';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-indicator-info',
  templateUrl: './indicator-info.component.html',
  styleUrls: ['./indicator-info.component.css']
})
export class IndicatorInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getIndicatorByIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  deleteIndicatorSubscription: Subscription;

  indicator: Indicator = new Indicator();
  tariff: Tariff = new Tariff();
  meter: Meter = new Meter();

  constructor(private indicatorService: IndicatorService,
              private meterService: MeterService,
              private tariffService: TariffService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.indicator = response.body;

            this.getTariffByIdSubscription = this.tariffService.getTariffById(this.indicator.tariffId)
              .subscribe((tariffResp: HttpResponse<any>) => {
                if (tariffResp) {
                  tokenSetter(tariffResp);
                  this.tariff = tariffResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

            this.getMeterByIdSubscription = this.meterService.getMeterById(this.indicator.meterId)
              .subscribe((meterResp: HttpResponse<any>) => {
                if (meterResp) {
                  tokenSetter(meterResp);
                  this.meter = meterResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  editIndicator(indicatorId: number) {
    this.router.navigate(['/indicator/' + indicatorId + '/update']);
  }

  deleteIndicator(indicatorId: number) {
    this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const indicator = response.body;

          this.deleteIndicatorSubscription = this.indicatorService.deleteIndicator(indicator)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                this.router.navigate(['/meter/' + this.meter.id + '/info']);
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
    if (this.getIndicatorByIdSubscription) {
      this.getIndicatorByIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.deleteIndicatorSubscription) {
      this.deleteIndicatorSubscription.unsubscribe();
    }
  }
}
