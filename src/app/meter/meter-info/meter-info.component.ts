import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {MeterService} from '../meter.service';
import {CategoryService} from '../../category/category.service';
import {UnitService} from '../../unit/unit.service';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import Meter from '../../models/Meter';
import Category from '../../models/Category';
import Unit from '../../models/Unit';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-meter-info',
  templateUrl: './meter-info.component.html',
  styleUrls: ['./meter-info.component.css']
})
export class MeterInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  getUnitByIdSubscription: Subscription;
  deleteMeterSubscription: Subscription;

  meter: Meter = new Meter();
  category: Category = new Category();
  unit: Unit = new Unit();

  constructor(private meterService: MeterService,
              private categoryService: CategoryService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getMeterByIdSubscription = this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter = response.body;

            this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.meter.category.id)
              .subscribe((categoryResp: HttpResponse<any>) => {
                if (categoryResp) {
                  tokenSetter(categoryResp);
                  this.category = categoryResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

            this.getUnitByIdSubscription = this.unitService.getUnitById(this.meter.unit.id)
              .subscribe((unitResp: HttpResponse<any>) => {
                if (unitResp) {
                  tokenSetter(unitResp);
                  this.unit = unitResp.body;
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

  editMeter(meterId: number) {
    this.router.navigate(['/meter/' + meterId + '/update']);
  }

  deleteMeter(meterId: number) {
    this.deleteMeterSubscription = this.meterService.deleteMeter(meterId)
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
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.getUnitByIdSubscription) {
      this.getUnitByIdSubscription.unsubscribe();
    }
    if (this.deleteMeterSubscription) {
      this.deleteMeterSubscription.unsubscribe();
    }
  }
}
