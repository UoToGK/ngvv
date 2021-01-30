

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  Type,
  SimpleChanges,
} from '@angular/core';
import { batch } from '../../helpers';
import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';
import { DyCalendarMonthCellComponent } from './calendar-month-cell.component';
import { DyDateService } from '../../services/date.service';

export const MONTHS_IN_VIEW = 12;
export const MONTHS_IN_COLUMN = 4;

@Component({
  selector: 'dy-calendar-month-picker',
  template: `
    <dy-calendar-picker
      [data]="months"
      [min]="min"
      [max]="max"
      [filter]="filter"
      [selectedValue]="date"
      [visibleDate]="month"
      [cellComponent]="cellComponent"
      [size]="size"
      (select)="onSelect($event)">
    </dy-calendar-picker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarMonthPickerComponent<D, T> implements OnChanges {

  @Input() min: D;

  @Input() max: D;

  @Input() filter: (D) => boolean;
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  /**
   * Visible month
   **/
  @Input() month: D;

  /**
   * Selected date
   **/
  @Input() date: D;

  @Output() monthChange: EventEmitter<D> = new EventEmitter();
  months: D[][];

  constructor(protected dateService: DyDateService<D>) {
  }

  @Input('cellComponent')
  set _cellComponent(cellComponent: Type<DyCalendarCell<D, T>>) {
    if (cellComponent) {
      this.cellComponent = cellComponent;
    }
  }
  cellComponent: Type<DyCalendarCell<any, any>> = DyCalendarMonthCellComponent;

  @HostBinding('class.size-large')
  get large() {
    return this.size === DyCalendarSize.LARGE;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.month) {
      this.initMonths();
    }
  }

  initMonths() {
    const date = this.dateService.getDate(this.month);
    const year = this.dateService.getYear(this.month);
    const firstMonth = this.dateService.createDate(year, 0, date);
    const months = [ firstMonth ];

    for (let monthIndex = 1; monthIndex < MONTHS_IN_VIEW; monthIndex++) {
      months.push(this.dateService.addMonth(firstMonth, monthIndex));
    }

    this.months = batch(months, MONTHS_IN_COLUMN);
  }

  onSelect(month: D) {
    this.monthChange.emit(month);
  }
}
