

import { Component, EventEmitter, Input, Output, Type } from '@angular/core';

import {
  DyCalendarCell,
  DyCalendarSize,
  DyCalendarViewMode,
  DyCalendarSizeValues,
  DyCalendarViewModeValues,
} from '../calendar-kit/model';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyCalendarRangeDayCellComponent } from './calendar-range-day-cell.component';
import { DyCalendarRangeYearCellComponent } from './calendar-range-year-cell.component';
import { DyCalendarRangeMonthCellComponent } from './calendar-range-month-cell.component';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';


export interface DyCalendarRange<D> {
  start: D;
  end?: D;
}

/**
 * CalendarRange component provides a capability to choose a date range.
 *
 * ```html
 * <dy-calendar [(date)]="date"></dy-calendar>
 * <dy-calendar [date]="date" (dateChange)="handleDateChange($event)"></dy-calendar>
 * ```
 *
 * Basic usage example
 * @stacked-example(Range, calendar/calendar-range-showcase.component)
 *
 * ### Installation
 *
 * Import `DyCalendarRangeModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyCalendarRangeModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * CalendarRange component supports all of the Calendar component customization properties. More defails can be found
 * in the [Calendar component docs](docs/components/calendar).
 *
 * @styles
 *
 * calendar-width:
 * calendar-background-color:
 * calendar-border-color:
 * calendar-border-style:
 * calendar-border-width:
 * calendar-border-radius:
 * calendar-text-color:
 * calendar-text-font-family:
 * calendar-text-font-size:
 * calendar-text-font-weight:
 * calendar-text-line-height:
 * calendar-picker-padding-top:
 * calendar-picker-padding-bottom:
 * calendar-picker-padding-start:
 * calendar-picker-padding-end:
 * calendar-navigation-text-color:
 * calendar-navigation-text-font-family:
 * calendar-navigation-title-text-font-size:
 * calendar-navigation-title-text-font-weight:
 * calendar-navigation-title-text-line-height:
 * calendar-navigation-padding:
 * calendar-cell-inactive-text-color:
 * calendar-cell-disabled-text-color:
 * calendar-cell-hover-background-color:
 * calendar-cell-hover-border-color:
 * calendar-cell-hover-text-color:
 * calendar-cell-hover-text-font-size:
 * calendar-cell-hover-text-font-weight:
 * calendar-cell-hover-text-line-height:
 * calendar-cell-active-background-color:
 * calendar-cell-active-border-color:
 * calendar-cell-active-text-color:
 * calendar-cell-active-text-font-size:
 * calendar-cell-active-text-font-weight:
 * calendar-cell-active-text-line-height:
 * calendar-cell-today-background-color:
 * calendar-cell-today-border-color:
 * calendar-cell-today-text-color:
 * calendar-cell-today-text-font-size:
 * calendar-cell-today-text-font-weight:
 * calendar-cell-today-text-line-height:
 * calendar-cell-today-hover-background-color:
 * calendar-cell-today-hover-border-color:
 * calendar-cell-today-active-background-color:
 * calendar-cell-today-active-border-color:
 * calendar-cell-today-disabled-border-color:
 * calendar-cell-today-selected-background-color:
 * calendar-cell-today-selected-border-color:
 * calendar-cell-today-selected-text-color:
 * calendar-cell-today-selected-hover-background-color:
 * calendar-cell-today-selected-hover-border-color:
 * calendar-cell-today-selected-active-background-color:
 * calendar-cell-today-selected-active-border-color:
 * calendar-cell-today-in-range-background-color:
 * calendar-cell-today-in-range-border-color:
 * calendar-cell-today-in-range-text-color:
 * calendar-cell-today-in-range-hover-background-color:
 * calendar-cell-today-in-range-hover-border-color:
 * calendar-cell-today-in-range-active-background-color:
 * calendar-cell-today-in-range-active-border-color:
 * calendar-cell-selected-background-color:
 * calendar-cell-selected-border-color:
 * calendar-cell-selected-text-color:
 * calendar-cell-selected-text-font-size:
 * calendar-cell-selected-text-font-weight:
 * calendar-cell-selected-text-line-height:
 * calendar-cell-selected-hover-background-color:
 * calendar-cell-selected-hover-border-color:
 * calendar-cell-selected-active-background-color:
 * calendar-cell-selected-active-border-color:
 * calendar-day-cell-width:
 * calendar-day-cell-height:
 * calendar-month-cell-width:
 * calendar-month-cell-height:
 * calendar-year-cell-width:
 * calendar-year-cell-height:
 * calendar-weekday-background:
 * calendar-weekday-divider-color:
 * calendar-weekday-divider-width:
 * calendar-weekday-text-color:
 * calendar-weekday-text-font-size:
 * calendar-weekday-text-font-weight:
 * calendar-weekday-text-line-height:
 * calendar-weekday-holiday-text-color:
 * calendar-weekday-height:
 * calendar-weekday-width:
 * calendar-weeknumber-background:
 * calendar-weeknumber-divider-color:
 * calendar-weeknumber-divider-width:
 * calendar-weeknumber-text-color:
 * calendar-weeknumber-text-font-size:
 * calendar-weeknumber-text-font-weight:
 * calendar-weeknumber-text-line-height:
 * calendar-weeknumber-height:
 * calendar-weeknumber-width:
 * calendar-large-width:
 * calendar-day-cell-large-width:
 * calendar-day-cell-large-height:
 * calendar-weekday-large-height:
 * calendar-weekday-large-width:
 * calendar-weeknumber-large-height:
 * calendar-weeknumber-large-width:
 * calendar-month-cell-large-width:
 * calendar-month-cell-large-height:
 * calendar-year-cell-large-width:
 * calendar-year-cell-large-height:
 * */
@Component({
  selector: 'dy-calendar-range',
  template: `
    <dy-base-calendar
      [date]="range"
      (dateChange)="onChange($any($event))"
      [min]="min"
      [max]="max"
      [filter]="filter"
      [startView]="startView"
      [boundingMonth]="boundingMonth"
      [dayCellComponent]="dayCellComponent"
      [monthCellComponent]="monthCellComponent"
      [yearCellComponent]="yearCellComponent"
      [visibleDate]="visibleDate"
      [showNavigation]="showNavigation"
      [size]="size"
      [showWeekNumber]="showWeekNumber"
      [weekNumberSymbol]="weekNumberSymbol"
    ></dy-base-calendar>
  `,
})
export class DyCalendarRangeComponent<D> {
  /**
   * Defines if we should render previous and next months
   * in the current month view.
   * */
  @Input() boundingMonth: boolean = true;

  /**
   * Defines starting view for the calendar.
   * */
  @Input() startView: DyCalendarViewMode = DyCalendarViewMode.DATE;
  static ngAcceptInputType_startView: DyCalendarViewModeValues;

  /**
   * A minimum available date for selection.
   * */
  @Input() min: D;

  /**
   * A maximum available date for selection.
   * */
  @Input() max: D;

  /**
   * A predicate that decides which cells will be disabled.
   * */
  @Input() filter: (D) => boolean;

  /**
   * Custom day cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input('dayCellComponent')
  set _cellComponent(cellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>>) {
    if (cellComponent) {
      this.dayCellComponent = cellComponent;
    }
  }
  dayCellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>> = DyCalendarRangeDayCellComponent;

  /**
   * Custom month cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input('monthCellComponent')
  set _monthCellComponent(cellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>>) {
    if (cellComponent) {
      this.monthCellComponent = cellComponent;
    }
  }
  @Input() monthCellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>> = DyCalendarRangeMonthCellComponent;

  /**
   * Custom year cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input('yearCellComponent')
  set _yearCellComponent(cellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>>) {
    if (cellComponent) {
      this.yearCellComponent = cellComponent;
    }
  }
  yearCellComponent: Type<DyCalendarCell<D, DyCalendarRange<D>>> = DyCalendarRangeYearCellComponent;

  /**
   * Size of the calendar and entire components.
   * Can be 'medium' which is default or 'large'.
   * */
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Input() visibleDate: D;

  /**
   * Determines should we show calendars navigation or not.
   * */
  @Input() showNavigation: boolean = true;

  /**
   * Range which will be rendered as selected.
   * */
  @Input() range: DyCalendarRange<D>;

  /**
   * Determines should we show week numbers column.
   * False by default.
   * */
  @Input()
  get showWeekNumber(): boolean {
    return this._showWeekNumber;
  }
  set showWeekNumber(value: boolean) {
    this._showWeekNumber = convertToBoolProperty(value);
  }
  protected _showWeekNumber: boolean = false;
  static ngAcceptInputType_showWeekNumber: DyBooleanInput;

  /**
   * Sets symbol used as a header for week numbers column
   * */
  @Input() weekNumberSymbol: string = '#';

  /**
   * Emits range when start selected and emits again when end selected.
   * */
  @Output() rangeChange: EventEmitter<DyCalendarRange<D>> = new EventEmitter();

  constructor(protected dateService: DyDateService<D>) {
  }

  onChange(date: D) {
    this.initDateIfNull();
    this.handleSelected(date);
  }

  private initDateIfNull() {
    if (!this.range) {
      this.range = { start: null, end: null };
    }
  }

  private handleSelected(date: D) {
    if (this.selectionStarted()) {
      this.selectEnd(date);
    } else {
      this.selectStart(date);
    }
  }

  private selectionStarted(): boolean {
    const { start, end } = this.range;
    return start && !end;
  }

  private selectStart(start: D) {
    this.selectRange({ start });
  }

  private selectEnd(date: D) {
    const { start } = this.range;

    if (this.dateService.compareDates(date, start) > 0) {
      this.selectRange({ start, end: date });
    } else {
      this.selectRange({ start: date, end: start });
    }
  }

  private selectRange(range: DyCalendarRange<D>) {
    this.range = range;
    this.rangeChange.emit(range);
  }
}
