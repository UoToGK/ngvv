import { Component } from '@angular/core';
import { DyDateService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatepickerComponent {

  min: Date;
  max: Date;

  constructor(protected dateService: DyDateService<Date>) {
    this.min = this.dateService.addDay(this.dateService.today(), -5);
    this.max = this.dateService.addDay(this.dateService.today(), 5);
  }
}
