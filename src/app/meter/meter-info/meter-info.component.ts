import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-meter-info',
  templateUrl: './meter-info.component.html',
  styleUrls: ['./meter-info.component.css']
})
export class MeterInfoComponent implements OnInit {

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
    this.route.params.subscribe( params => {
      this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter = response.body;

            this.categoryService.getCategoryById(this.meter.category.id)
              .subscribe((categoryResp: HttpResponse<any>) => {
                if (categoryResp) {
                  tokenSetter(categoryResp);
                  this.category = categoryResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

            this.unitService.getUnitById(this.meter.unit.id)
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
    this.meterService.deleteMeter(meterId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/all']);
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

}
