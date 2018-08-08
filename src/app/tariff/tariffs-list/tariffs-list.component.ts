import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {TariffService} from '../tariff.service';
import Tariff from '../../models/Tariff';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitService} from '../../unit/unit.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-tariffs-list',
  templateUrl: './tariffs-list.component.html',
  styleUrls: ['./tariffs-list.component.css']
})
export class TariffsListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByCategoryIdSubscription: Subscription;
  deleteTariffSubscription: Subscription;

  @Input() categoryId: number;
  tariffs: Tariff[] = [];

  constructor(private tariffService: TariffService,
              private unitService: UnitService,
              private route: ActivatedRoute,
              private router: Router) { }

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
    this.deleteTariffSubscription = this.tariffService.deleteTariff(tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          $event.stopPropagation();
          this.router.navigate(['category/' + this.categoryId + '/tariffs/info']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getTariffByCategoryIdSubscription) {
      this.getTariffByCategoryIdSubscription.unsubscribe();
    }
    if (this.deleteTariffSubscription) {
      this.deleteTariffSubscription.unsubscribe();
    }
  }
}
