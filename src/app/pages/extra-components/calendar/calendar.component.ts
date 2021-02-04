import { Component } from '@angular/core';
import { DyCalendarRange, DyDateService } from 'src/framework/theme/public_api';
import { DayCellComponent } from './day-cell/day-cell.component';

@Component({
  selector: 'ngx-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  entryComponents: [DayCellComponent],
})
export class CalendarComponent {

  date = new Date();
  date2 = new Date();
  range: DyCalendarRange<Date>;
  dayCellComponent = DayCellComponent;

  constructor(protected dateService: DyDateService<Date>) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }
}
