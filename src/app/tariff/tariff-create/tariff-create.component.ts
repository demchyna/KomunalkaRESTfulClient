import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {CategoryService} from '../../category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import Category from '../../models/Category';
import Tariff from '../../models/Tariff';
import {TariffService} from '../tariff.service';
import {UnitService} from '../../unit/unit.service';
import Unit from '../../models/Unit';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../../user/user.service';

@Component({
  selector: 'app-tariff-create',
  templateUrl: './tariff-create.component.html',
  styleUrls: ['./tariff-create.component.css']
})
export class TariffCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  getAllUnitsSubscription: Subscription;
  createTariffSubscription: Subscription;

  category: Category = new Category();
  units: Unit[] = [];

  constructor(private categoryService: CategoryService,
              private tariffService: TariffService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getCategoryByIdSubscription = this.categoryService.getCategoryById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.category = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });

    this.getAllUnitsSubscription = this.unitService.getAllUnits()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.units = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  createTariff(data: any): void {
    const tariff = new Tariff();

    tariff.name = data.name;
    tariff.rate = data.rate;
    tariff.currency = data.currency;
    tariff.begin_date = data.begin_date;
    if (data.end_date) {
      tariff.end_date = data.end_date;
    }
    tariff.description = data.description;
    tariff.category = this.category;
    tariff.unit = data.unit;

    this.createTariffSubscription = this.tariffService.createTariff(tariff)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/user/' + this.userService.currentUser.id]);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.getAllUnitsSubscription) {
      this.getAllUnitsSubscription.unsubscribe();
    }
    if (this.createTariffSubscription) {
      this.createTariffSubscription.unsubscribe();
    }
  }
}
