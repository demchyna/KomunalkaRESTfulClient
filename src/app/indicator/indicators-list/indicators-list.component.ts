import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IndicatorService} from '../indicator.service';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Indicator from '../../models/Indicator';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs';
import {OrderPipe} from 'ngx-order-pipe';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {changeDateFormat} from '../../helpers/date-format-helper';

@Component({
  selector: 'app-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.css'],
})
export class IndicatorsListComponent implements OnInit, OnChanges, OnDestroy {

  getIndicatorByMeterIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getIndicatorByIdSubscription: Subscription;
  deleteIndicatorSubscription: Subscription;

  @Input() meterProps: Meter;
  indicators: Indicator[] = [];
  indicatorDateValue = '';
  tariffRateValue = '';
  indicatorPriceValue = '';
  indicatorStatusValue = '';
  indicatorCurrentValue = '';
  order = 'date';
  reverse = true;
  currentPage = 1;
  itemsNumber = 10;
  maxIntegerValue = Number.MAX_SAFE_INTEGER;
  sortedIndicators: Indicator[] = [];

  dateFormatter = changeDateFormat;

  constructor(private indicatorService: IndicatorService,
              private router: Router,
              private orderPipe: OrderPipe,
              private spinnerService: Ng4LoadingSpinnerService) {

    this.sortedIndicators = orderPipe.transform(this.indicators, 'date');
  }

  ngOnInit() {
    this.spinnerService.show();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['meterProps'] && this.meterProps.id !== undefined) {
      this.getIndicatorByMeterIdSubscription = this.indicatorService.getIndicatorByMeterId(this.meterProps.id)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.indicators = response.body;
          }
          this.spinnerService.hide();
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
    $event.stopPropagation();

    this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const indicator = response.body;

          this.deleteIndicatorSubscription = this.indicatorService.deleteIndicator(indicator)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
                  this.router.navigate(['/meter/' + this.meterProps.id + '/indicators/info']));
              }
            }, (appError: AppError) => {
              throw appError;
            });

        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  clickEvent($event) {
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.getIndicatorByMeterIdSubscription) {
      this.getIndicatorByMeterIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getIndicatorByIdSubscription) {
      this.getIndicatorByIdSubscription.unsubscribe();
    }
    if (this.deleteIndicatorSubscription) {
      this.deleteIndicatorSubscription.unsubscribe();
    }
  }
}
