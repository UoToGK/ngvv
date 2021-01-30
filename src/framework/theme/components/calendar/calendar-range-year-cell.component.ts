

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
  selector: 'dy-calendar-range-year-cell',
  template: `
    <div class="cell-content">
      {{ year }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarRangeYearCellComponent<D> extends DyBaseCalendarRangeCell<D>
  implements DyCalendarCell<D, DyCalendarRange<D>> {
  @Input() date: D;

  @Input() min: D;

  @Input() max: D;

  @Input() selectedValue: DyCalendarRange<D>;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  @HostBinding('class.in-range')
  get inRange(): boolean {
    return this.hasRange && this.isInRange(this.date, this.selectedValue);
  }

  @HostBinding('class.start')
  get rangeStart(): boolean {
    return this.hasRange && this.dateService.isSameYear(this.date, this.selectedValue.start);
  }

  @HostBinding('class.end')
  get rangeEnd(): boolean {
    return this.hasRange && this.dateService.isSameYear(this.date, this.selectedValue.end);
  }

  @HostBinding('class.selected')
  get selected(): boolean {
    if (this.inRange) {
      return true;
    }

    if (this.selectedValue) {
      return this.dateService.isSameYearSafe(this.date, this.selectedValue.start);
    }
  }

  @HostBinding('class.today')
  get today(): boolean {
    return this.dateService.isSameYear(this.date, this.dateService.today());
  }

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  @HostBinding('class.year-cell')
  yearCellClass = true;

  @HostBinding('class.range-cell')
  rangeCellClass = true;

  get year(): number {
    return this.dateService.getYear(this.date);
  }

  @HostListener('click')
  onClick() {
    if (this.disabled) {
      return;
    }

    this.select.emit(this.date);
  }

  protected smallerThanMin(): boolean {
    return this.date && this.min && this.dateService.compareDates(this.yearEnd(), this.min) < 0;
  }

  protected greaterThanMax(): boolean {
    return this.date && this.max && this.dateService.compareDates(this.yearStart(), this.max) > 0;
  }

  protected yearStart(): D {
    return this.dateService.getYearStart(this.date);
  }

  protected yearEnd(): D {
    return this.dateService.getYearEnd(this.date);
  }

  protected isInRange(date: D, { start, end }: DyCalendarRange<D>): boolean {
    if (start && end) {
      const cellYear = this.dateService.getYear(date);
      const startYear = this.dateService.getYear(start);
      const endYear = this.dateService.getYear(end);

      return cellYear >= startYear && cellYear <= endYear;
    }

    return this.dateService.isSameYear(date, start);
  }
}
