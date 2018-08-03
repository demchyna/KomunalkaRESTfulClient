import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {MeterService} from '../meter.service';
import Meter from '../../models/Meter';
import {UserService} from '../../user/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-meters-list',
  templateUrl: './meters-list.component.html',
  styleUrls: ['./meters-list.component.css']
})
export class MetersListComponent implements OnInit, OnChanges {

  @Input() private categoryId: number;
  meters: Meter[];

  constructor(private meterService: MeterService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.meters = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId !== undefined) {
      this.meterService.getMeterByCategoryIdAndUserId(this.categoryId, this.userService.currentUser.id)
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

}
