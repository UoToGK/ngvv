import { Component, EventEmitter } from '@angular/core';
import {
  DyCalendarCell,
  DyCalendarDayPickerComponent,
  DyCalendarMonthModelService,
  DyDateService,
} from 'src/framework/theme/public_api';
import { TranslationWidth } from '@angular/common';

@Component({
  selector: 'ngx-calendar-kit-month-cell',
  styleUrls: ['month-cell.component.scss'],
  templateUrl: 'month-cell.component.html',
})
export class CalendarKitMonthCellComponent extends DyCalendarDayPickerComponent<Date, Date>
  implements DyCalendarCell<Date, Date> {
  select: EventEmitter<Date> = new EventEmitter();
  selectedValue: Date;

  constructor(private dateService: DyDateService<Date>, monthModel: DyCalendarMonthModelService<Date>) {
    super(monthModel);
  }

  get title() {
    return this.dateService.getMonthName(this.date, TranslationWidth.Wide);
  }
}
