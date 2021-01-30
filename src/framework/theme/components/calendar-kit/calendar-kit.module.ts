

import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DySharedModule } from '../shared/shared.module';
import { DyButtonModule } from '../button/button.module';
import { DyIconModule } from '../icon/icon.module';

import { DyCalendarMonthModelService } from './services/calendar-month-model.service';
import { DyDateService } from './services/date.service';

import { DyCalendarDayCellComponent } from './components/calendar-day-picker/calendar-day-cell.component';
import { DyCalendarDayPickerComponent } from './components/calendar-day-picker/calendar-day-picker.component';
import { DyCalendarDaysNamesComponent } from './components/calendar-days-names/calendar-days-names.component';
import { DyCalendarMonthCellComponent } from './components/calendar-month-picker/calendar-month-cell.component';
import { DyCalendarMonthPickerComponent } from './components/calendar-month-picker/calendar-month-picker.component';
import { DyCalendarViewModeComponent } from './components/calendar-navigation/calendar-view-mode.component';
import {
  DyCalendarPageableNavigationComponent,
} from './components/calendar-navigation/calendar-pageable-navigation.component';
import { DyCalendarPickerComponent } from './components/calendar-picker/calendar-picker.component';
import { DyCalendarPickerRowComponent } from './components/calendar-picker/calendar-picker-row.component';
import { DyCalendarYearCellComponent } from './components/calendar-year-picker/calendar-year-cell.component';
import { DyCalendarYearPickerComponent } from './components/calendar-year-picker/calendar-year-picker.component';
import { DyCalendarWeekNumberComponent } from './components/calendar-week-number/calendar-week-number.component';

import { DyNativeDateService } from './services/native-date.service';
import { DyCalendarYearModelService } from './services/calendar-year-model.service';
import { DyCalendarTimeModelService } from './services/calendar-time-model.service';
import { DyCalendarActionsComponent } from './components/calendar-actions/calendar-actions.component';


const SERVICES = [
  { provide: DyDateService, useClass: DyNativeDateService },
  DatePipe,
  DyCalendarMonthModelService,
  DyCalendarYearModelService,
  DyCalendarTimeModelService,
];

const COMPONENTS = [
  DyCalendarViewModeComponent,
  DyCalendarPageableNavigationComponent,
  DyCalendarDaysNamesComponent,
  DyCalendarYearPickerComponent,
  DyCalendarMonthPickerComponent,
  DyCalendarDayPickerComponent,
  DyCalendarDayCellComponent,
  DyCalendarActionsComponent,
  DyCalendarMonthCellComponent,
  DyCalendarYearCellComponent,
  DyCalendarPickerRowComponent,
  DyCalendarPickerComponent,
  DyCalendarWeekNumberComponent,
];

/**
 * `DyCalendarKitModule` is a module that contains multiple useful components for building custom calendars.
 * So if you think our calendars is not enough powerful for you just use calendar-kit and build your own calendar!
 *
 * Available components:
 * - `DyCalendarDayPicker`
 * - `DyCalendarDayCell`
 * - `DyCalendarMonthPicker`
 * - `DyCalendarMonthCell`
 * - `DyCalendarYearPicker`
 * - `DyCalendarYearCell`
 * - `DyCalendarViewModeComponent`
 * - `DyCalendarPageableNavigation`
 *
 * For example you can easily build full calendar:
 * @stacked-example(Full calendar, calendar-kit/calendar-kit-full-calendar.component)
 * */
@NgModule({
  imports: [ DySharedModule, DyButtonModule, DyIconModule ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
  entryComponents: [
    DyCalendarDayCellComponent,
    DyCalendarMonthCellComponent,
    DyCalendarYearCellComponent,
  ],
})
export class DyCalendarKitModule {
}
