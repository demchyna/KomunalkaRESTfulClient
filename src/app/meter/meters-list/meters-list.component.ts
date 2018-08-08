import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {MeterService} from '../meter.service';
import Meter from '../../models/Meter';
import {UserService} from '../../user/user.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-meters-list',
  templateUrl: './meters-list.component.html',
  styleUrls: ['./meters-list.component.css']
})
export class MetersListComponent implements OnInit, OnChanges, OnDestroy {

  getMeterByCategoryIdSubscription: Subscription;

  @Input() private categoryId: number;
  meters: Meter[];

  constructor(private meterService: MeterService, private router: Router) {
  }

  ngOnInit() {
    this.meters = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId !== undefined) {
      this.getMeterByCategoryIdSubscription = this.meterService.getMeterByCategoryId(this.categoryId)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meters = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    }
  }

  selectedMeter(meterId: number) {
    this.router.navigate(['/meter/' + meterId + '/indicators/info']);
  }

  ngOnDestroy(): void {
    if (this.getMeterByCategoryIdSubscription) {
      this.getMeterByCategoryIdSubscription.unsubscribe();
    }
  }
}
