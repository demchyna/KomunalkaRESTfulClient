import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Indicator from '../../models/Indicator';
import {IndicatorService} from '../indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import Meter from '../../models/Meter';
import Tariff from '../../models/Tariff';

@Component({
  selector: 'app-indicator-update',
  templateUrl: './indicator-update.component.html',
  styleUrls: ['./indicator-update.component.css']
})
export class IndicatorUpdateComponent implements OnInit {

  indicator: Indicator = new Indicator();
  private indicatorId: number;
  meter: Meter = new Meter();
  tariffs: Tariff[] = [];
  currentTariffId: number;

  constructor(private indicatorService: IndicatorService,
              private meterService: MeterService,
              private tariffService: TariffService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe( params => this.indicatorId = params['id']);
  }

  ngOnInit() {
    this.indicatorService.getIndicatorById(this.indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.indicator = response.body;
          this.meterService.getMeterById(this.indicator.meterId)
            .subscribe((meterResp: HttpResponse<any>) => {
              if (meterResp) {
                tokenSetter(meterResp);
                this.meter = meterResp.body;

                this.tariffService.getTariffByCategoryId(this.meter.category.id)
                  .subscribe((tariffResp: HttpResponse<any>) => {
                    if (tariffResp) {
                      this.tariffs = tariffResp.body;

                      this.tariffs.map((tariff, index) => {
                        if (tariff.id === this.indicator.tariffId) {
                          this.currentTariffId = index;
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
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateIndicator(data: any): void {

    this.indicator.current = data.current;
    this.indicator.date = data.date;
    this.indicator.status = data.status;
    this.indicator.tariffId = data.tariff.id;
    this.indicator.description = data.description;

    this.indicatorService.updateIndicator(this.indicator)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/indicator/' + this.indicatorId + '/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }
}