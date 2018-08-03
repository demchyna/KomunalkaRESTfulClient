import {Component, Input, OnInit} from '@angular/core';
import {MeterService} from '../meter.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Meter from '../../models/Meter';

@Component({
  selector: 'app-meter-indicators-info',
  templateUrl: './meter-indicators-info.component.html',
  styleUrls: ['./meter-indicators-info.component.css']
})
export class MeterIndicatorsInfoComponent implements OnInit {

  meter: Meter = new Meter();

  constructor(private meterService: MeterService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter  = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  meterInfo(meterId: number) {
    this.router.navigate(['/meter/' + meterId + '/info']);
  }

}
