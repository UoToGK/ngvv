

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../calendar-kit/model';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyCalendarRange } from './calendar-range.component';
import { DyBaseCalendarRangeCell } from './base-calendar-range-cell';

@Component({
  selector: 'dy-calendar-range-month-cell',
  template: `
    <div class="cell-content">
      {{ month }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarRangeMonthCellComponent<D> extends DyBaseCalendarRangeCell<D>
                                                  implements DyCalendarCell<D, DyCalendarRange<D>> {

  get month(): string {
    return this.dateService.getMonthName(this.date);
  }

  @Input() date: D;
  @Input() visibleDate: D;

  @Input() selectedValue: DyCalendarRange<D>;
  @Input() min: D;
  @Input() max: D;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  @HostBinding('class.month-cell')
  monthCellClass = true;

  @HostBinding('class.range-cell')
  rangeCellClass = true;

  @HostBinding('class.selected')
  get selected(): boolean {
    if (this.inRange) {
      return true;
    }

    if (this.selectedValue) {
      return this.dateService.isSameMonthSafe(this.date, this.selectedValue.start);
    }
  }

  @HostBinding('class.in-range')
  get inRange(): boolean {
    if (this.hasRange) {
      return this.isInRage(this.date, this.selectedValue);
    }
  }

  @HostBinding('class.start')
  get rangeStart(): boolean {
    if (this.hasRange) {
      return this.dateService.isSameMonth(this.date, this.selectedValue.start);
    }
  }

  @HostBinding('class.end')
  get rangeEnd(): boolean {
    if (this.hasRange) {
      return this.dateService.isSameMonth(this.date, this.selectedValue.end);
    }
  }

  @HostBinding('class.today')
  get today(): boolean {
    return this.dateService.isSameMonthSafe(this.date, this.dateService.today());
  }

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  @HostListener('click')
  onClick() {
    if (this.disabled) {
      return;
    }

    this.select.emit(this.date);
  }

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  protected smallerThanMin(): boolean {
    return this.date && this.min && this.dateService.compareDates(this.monthEnd(), this.min) < 0;
  }

  protected greaterThanMax(): boolean {
    return this.date && this.max && this.dateService.compareDates(this.monthStart(), this.max) > 0;
  }

  protected monthStart(): D {
    return this.dateService.getMonthStart(this.date);
  }

  protected monthEnd(): D {
    return this.dateService.getMonthEnd(this.date);
  }

  protected isInRage(date: D, range: DyCalendarRange<D>): boolean {
    if (range.start && range.end) {
      const cellDate = this.dateService.getMonthStart(date);
      const start = this.dateService.getMonthStart(range.start);
      const end = this.dateService.getMonthStart(range.end);

      const isGreaterThanStart = this.dateService.compareDates(cellDate, start) >= 0;
      const isLessThanEnd = this.dateService.compareDates(cellDate, end) <= 0;

      return isGreaterThanStart && isLessThanEnd;
    }

    return this.dateService.isSameMonth(date, range.start);
  }
}
