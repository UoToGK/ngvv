

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  Type,
} from '@angular/core';

import { DyCalendarMonthModelService } from '../../services/calendar-month-model.service';
import { DyCalendarDayCellComponent } from './calendar-day-cell.component';
import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';
import { convertToBoolProperty, DyBooleanInput } from '../../../helpers';


/**
 * Provides capability pick days.
 * */
@Component({
  selector: 'dy-calendar-day-picker',
  template: `
    <dy-calendar-week-numbers *ngIf="showWeekNumber"
                              [weeks]="weeks"
                              [size]="size"
                              [weekNumberSymbol]="weekNumberSymbol">
    </dy-calendar-week-numbers>
    <div class="days-container">
      <dy-calendar-days-names [size]="size"></dy-calendar-days-names>
      <dy-calendar-picker
          [data]="weeks"
          [visibleDate]="visibleDate"
          [selectedValue]="date"
          [cellComponent]="cellComponent"
          [min]="min"
          [max]="max"
          [filter]="filter"
          [size]="size"
          (select)="onSelect($event)">
      </dy-calendar-picker>
    </div>
  `,
  styleUrls: ['./calendar-day-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarDayPickerComponent<D, T> implements OnChanges {

  /**
   * Describes which month picker have to render.
   * */
  @Input() visibleDate: D;

  /**
   * Defines if we should render previous and next months
   * in the current month view.
   * */
  @Input() boundingMonths: boolean = true;

  /**
   * Minimum available date for selection.
   * */
  @Input() min: D;

  /**
   * Maximum available date for selection.
   * */
  @Input() max: D;

  /**
   * Predicate that decides which cells will be disabled.
   * */
  @Input() filter: (D) => boolean;

  /**
   * Custom day cell component. Have to implement `DyCalendarCell` interface.
   * */
  @Input('cellComponent')
  set setCellComponent(cellComponent: Type<DyCalendarCell<D, T>>) {
    if (cellComponent) {
      this.cellComponent = cellComponent;
    }
  }
  cellComponent: Type<DyCalendarCell<any, any>> = DyCalendarDayCellComponent;

  /**
   * Size of the component.
   * Can be 'medium' which is default or 'large'.
   * */
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  /**
   * Already selected date.
   * */
  @Input() date: T;

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
  @Input() weekNumberSymbol: string;

  /**
   * Fires newly selected date.
   * */
  @Output() dateChange = new EventEmitter<D>();

  @HostBinding('class.size-large')
  get large() {
    return this.size === DyCalendarSize.LARGE;
  }

  /**
   * Day picker model.
   * Provides all days in current month and if boundingMonth is true some days
   * from previous and next one.
   * */
  weeks: D[][];

  constructor(private monthModel: DyCalendarMonthModelService<D>) {
  }

  ngOnChanges({ visibleDate, boundingMonths }: SimpleChanges) {
    if (visibleDate || boundingMonths) {
      this.weeks = this.monthModel.createDaysGrid(this.visibleDate, this.boundingMonths);
    }
  }

  onSelect(day: D) {
    this.dateChange.emit(day);
  }
}
