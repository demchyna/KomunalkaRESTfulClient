import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {TariffService} from '../tariff.service';
import Tariff from '../../models/Tariff';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitService} from '../../unit/unit.service';
import {Subscription} from 'rxjs';
import {OrderPipe} from 'ngx-order-pipe';
import {changeDateFormat} from '../../helpers/date-format-helper';

@Component({
  selector: 'app-tariffs-list',
  templateUrl: './tariffs-list.component.html',
  styleUrls: ['./tariffs-list.component.css']
})
export class TariffsListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByCategoryIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  deleteTariffSubscription: Subscription;

  @Input() categoryId: number;
  tariffs: Tariff[] = [];
  nameValue = '';
  rateValue = '';
  descriptionValue = '';
  beginDateValue = '';
  endDateValue = '';
  order = 'name';
  reverse = false;
  currentPage = 1;
  itemsNumber = 10;
  maxIntegerValue = Number.MAX_SAFE_INTEGER;
  sortedTariffs: Tariff[] = [];

  dateFormatter = changeDateFormat;

  constructor(private tariffService: TariffService,
              private unitService: UnitService,
              private route: ActivatedRoute,
              private router: Router,
              private orderPipe: OrderPipe) {

    this.sortedTariffs = this.orderPipe.transform(this.tariffs, 'name');
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getTariffByCategoryIdSubscription = this.tariffService.getTariffByCategoryId(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.tariffs = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  addTariff() {
    this.router.navigate(['tariff/create/category/' + this.categoryId]);
  }

  selectedRow(tariffId: number) {
    this.router.navigate(['/tariff/' + tariffId + '/info']);
  }

  editTariff(tariffId: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['/tariff/' + tariffId + '/update']);
  }

  deleteTariff(tariffId: number, $event) {
    $event.stopPropagation();

    this.getTariffByIdSubscription = this.tariffService.getTariffById(tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const tariff = response.body;

          this.deleteTariffSubscription = this.tariffService.deleteTariff(tariff)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
                  this.router.navigate(['category/' + this.categoryId + '/tariffs/info']));
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
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getTariffByCategoryIdSubscription) {
      this.getTariffByCategoryIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.deleteTariffSubscription) {
      this.deleteTariffSubscription.unsubscribe();
    }
  }
}
