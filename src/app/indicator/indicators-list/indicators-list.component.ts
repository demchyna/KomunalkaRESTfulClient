import {Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IndicatorService} from '../indicator.service';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Indicator from '../../models/Indicator';
import Meter from '../../models/Meter';
import {TariffService} from '../../tariff/tariff.service';
import Tariff from '../../models/Tariff';
import {Observable} from 'rxjs/Observable';
import {log} from 'util';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.css'],
})
export class IndicatorsListComponent implements OnInit, OnChanges, OnDestroy {

  getIndicatorByMeterIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  deleteIndicatorSubscription: Subscription;

  @Input() meterProps: Meter;
  indicatorsAndTariffs: IndicatorAndTariff[] = [];

  constructor(private indicatorService: IndicatorService, private tariffService: TariffService, private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['meterProps'] && this.meterProps.id !== undefined) {
      this.getIndicatorByMeterIdSubscription = this.indicatorService.getIndicatorByMeterId(this.meterProps.id)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);

            let indicators: Indicator[], tariff: Tariff;
            indicators = response.body;

            indicators.forEach((indicator) => {
              this.getTariffByIdSubscription = this.tariffService.getTariffById(indicator.tariffId)
                .subscribe((resp: HttpResponse<any>) => {
                  if (resp) {
                    tokenSetter(resp);
                    tariff = resp.body;
                    const indicatorAndTariff = {
                      'indicator': indicator,
                      'tariff': tariff
                    };
                    this.indicatorsAndTariffs.push(indicatorAndTariff);
                  }
                }, (appError: AppError) => {
                  throw appError;
                });
            });
          }
        }, (appError: AppError) => {
          throw appError;
        });
    }
  }

  addIndicator() {
    this.router.navigate(['indicator/create/meter/' + this.meterProps.id]);
  }

  selectedRow(indicatorId: number) {
    this.router.navigate(['/indicator/' + indicatorId + '/info']);
  }

  editIndicator(indicatorId: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['/indicator/' + indicatorId + '/update']);
  }

  deleteIndicator(indicatorId: number, $event) {
    this.deleteIndicatorSubscription = this.indicatorService.deleteIndicator(indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          $event.stopPropagation();
          this.router.navigate(['/meter/' + this.meterProps.id + '/indicators/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.getIndicatorByMeterIdSubscription) {
      this.getIndicatorByMeterIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.deleteIndicatorSubscription) {
      this.deleteIndicatorSubscription.unsubscribe();
    }
  }
}

interface IndicatorAndTariff {
  indicator: Indicator;
  tariff: Tariff;
}
