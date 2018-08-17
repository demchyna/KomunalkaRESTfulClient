import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {CategoryService} from '../../category/category.service';
import {TariffService} from '../tariff.service';
import {ActivatedRoute, Router} from '@angular/router';
import Tariff from '../../models/Tariff';
import Category from '../../models/Category';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-tariff-info',
  templateUrl: './tariff-info.component.html',
  styleUrls: ['./tariff-info.component.css']
})
export class TariffInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteTariffSubscription: Subscription;

  tariff: Tariff = new Tariff();
  category: Category = new Category();

  constructor(private tariffService: TariffService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getTariffByIdSubscription = this.tariffService.getTariffById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.tariff = response.body;

            this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.tariff.category.id)
              .subscribe((categoryResp: HttpResponse<any>) => {
                if (categoryResp) {
                  tokenSetter(categoryResp);
                  this.category = categoryResp.body;
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

  editTariff(tariffId: number) {
    this.router.navigate(['/tariff/' + tariffId + '/update']);
  }

  deleteTariff(tariffId: number, $event) {
    this.getTariffByIdSubscription = this.tariffService.getTariffById(tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const tariff = response.body;

          this.deleteTariffSubscription = this.tariffService.deleteTariff(tariff)
            .subscribe((deleteResp: HttpResponse<any>) => {
              if (deleteResp) {
                this.router.navigate(['category/' + this.category.id + '/tariffs/info']);
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
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteTariffSubscription) {
      this.deleteTariffSubscription.unsubscribe();
    }
  }
}
