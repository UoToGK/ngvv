

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';
import { DyDateService } from '../../services/date.service';


@Component({
  selector: 'dy-calendar-day-cell',
  template: `
    <div class="cell-content">
      {{ day }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarDayCellComponent<D> implements DyCalendarCell<D, D> {

  @Input() date: D;

  @Input() selectedValue: D;

  @Input() visibleDate: D;

  @Input() min: D;

  @Input() max: D;

  @Input() filter: (D) => boolean;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  constructor(protected dateService: DyDateService<D>) {
  }

  @HostBinding('class.today') get today(): boolean {
    return this.dateService.isSameDaySafe(this.date, this.dateService.today());
  }

  @HostBinding('class.bounding-month') get boundingMonth(): boolean {
    return !this.dateService.isSameMonthSafe(this.date, this.visibleDate);
  }

  @HostBinding('class.selected') get selected(): boolean {
    return this.dateService.isSameDaySafe(this.date, this.selectedValue);
  }

  @HostBinding('class.empty') get empty(): boolean {
    return !this.date;
  }

  @HostBinding('class.disabled') get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax() || this.dontFitFilter();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  @HostBinding('class.day-cell')
  dayCellClass = true;

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

  private smallerThanMin(): boolean {
    return this.date && this.min && this.dateService.compareDates(this.date, this.min) < 0;
  }

  private greaterThanMax(): boolean {
    return this.date && this.max && this.dateService.compareDates(this.date, this.max) > 0;
  }

  private dontFitFilter(): boolean {
    return this.date && this.filter && !this.filter(this.date);
  }
}
