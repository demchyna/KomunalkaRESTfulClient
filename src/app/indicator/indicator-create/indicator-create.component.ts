import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-indicator-create',
  templateUrl: './indicator-create.component.html',
  styleUrls: ['./indicator-create.component.css']
})
export class IndicatorCreateComponent implements OnInit {

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
    this.route.params.subscribe( params => {
      this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter = response.body;

            this.tariffService.getTariffByCategoryId(this.meter.category.id)
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

      this.indicatorService.getLastAddedIndicatorByMeterId(params['id'])
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

    this.indicatorService.createIndicator(indicator)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/meter/' + indicator.meterId + '/indicators/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
