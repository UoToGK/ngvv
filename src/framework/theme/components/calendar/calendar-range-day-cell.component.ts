

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core';

import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../calendar-kit/model';
import { DyCalendarRange } from './calendar-range.component';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyBaseCalendarRangeCell } from './base-calendar-range-cell';

@Component({
  selector: 'dy-calendar-range-day-cell',
  template: `
    <div class="cell-content">{{ day }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarRangeDayCellComponent<D> extends DyBaseCalendarRangeCell<D>
  implements DyCalendarCell<D, DyCalendarRange<D>> {
  @Input() date: D;

  @Input() selectedValue: DyCalendarRange<D>;

  @Input() visibleDate: D;

  @Input() min: D;

  @Input() max: D;

  @Input() filter: (D) => boolean;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  @HostBinding('class.in-range')
  get inRange(): boolean {
    if (this.date && this.hasRange) {
      return this.isInRange(this.date, this.selectedValue);
    }

    return false;
  }

  @HostBinding('class.start')
  get start(): boolean {
    return this.date && this.hasRange && this.dateService.isSameDay(this.date, this.selectedValue.start);
  }

  @HostBinding('class.end')
  get end(): boolean {
    return this.date && this.hasRange && this.dateService.isSameDay(this.date, this.selectedValue.end);
  }

  @HostBinding('class.range-cell')
  rangeCellClass = true;

  @HostBinding('class.day-cell')
  dayCellClass = true;

  @HostBinding('class.today')
  get today(): boolean {
    return this.date && this.dateService.isSameDay(this.date, this.dateService.today());
  }

  @HostBinding('class.bounding-month')
  get boundingMonth(): boolean {
    return !this.dateService.isSameMonthSafe(this.date, this.visibleDate);
  }

  @HostBinding('class.selected')
  get selected(): boolean {
    if (this.inRange) {
      return true;
    }

    if (this.selectedValue) {
      return this.dateService.isSameDaySafe(this.date, this.selectedValue.start);
    }
  }

  @HostBinding('class.empty')
  get empty(): boolean {
    return !this.date;
  }

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax() || this.dontFitFilter();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  get day(): number {
    return this.date && this.dateService.getDate(this.date);
  }

  @HostListener('click')
  onClick() {
    if (this.disabled || this.empty) {
      return;
    }

    this.select.emit(this.date);
  }

  protected smallerThanMin(): boolean {
    return this.date && this.min && this.dateService.compareDates(this.date, this.min) < 0;
  }

  protected greaterThanMax(): boolean {
    return this.date && this.max && this.dateService.compareDates(this.date, this.max) > 0;
  }

  protected dontFitFilter(): boolean {
    return this.date && this.filter && !this.filter(this.date);
  }

  protected isInRange(date: D, { start, end }: DyCalendarRange<D>): boolean {
    const isGreaterThanStart = this.dateService.compareDates(this.date, start) >= 0;
    const isLessThanEnd = this.dateService.compareDates(this.date, end) <= 0;

    return isGreaterThanStart && isLessThanEnd;
  }
}
