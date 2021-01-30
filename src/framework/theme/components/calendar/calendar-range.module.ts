

import { NgModule } from '@angular/core';

import { DyCalendarRangeComponent } from './calendar-range.component';
import { DyCalendarRangeDayCellComponent } from './calendar-range-day-cell.component';
import { DyCalendarRangeYearCellComponent } from './calendar-range-year-cell.component';
import { DyCalendarRangeMonthCellComponent } from './calendar-range-month-cell.component';
import { DyBaseCalendarModule } from './base-calendar.module';


@NgModule({
  imports: [DyBaseCalendarModule],
  exports: [DyCalendarRangeComponent],
  declarations: [
    DyCalendarRangeComponent,
    DyCalendarRangeDayCellComponent,
    DyCalendarRangeYearCellComponent,
    DyCalendarRangeMonthCellComponent,
  ],
  entryComponents: [
    DyCalendarRangeDayCellComponent,
    DyCalendarRangeMonthCellComponent,
    DyCalendarRangeYearCellComponent,
  ],
})
export class DyCalendarRangeModule {
}
