

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
  selector: 'dy-calendar-month-cell',
  template: `
    <div class="cell-content">
      {{ month }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarMonthCellComponent<D> implements DyCalendarCell<D, D> {
  @Input() date: D;

  @Input() selectedValue: D;

  @Input() min: D;

  @Input() max: D;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  constructor(private dateService: DyDateService<D>) {
  }

  @HostBinding('class.selected') get selected(): boolean {
    return this.dateService.isSameMonthSafe(this.date, this.selectedValue);
  }

  @HostBinding('class.today') get today(): boolean {
    return this.dateService.isSameMonthSafe(this.date, this.dateService.today());
  }

  @HostBinding('class.disabled') get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  @HostBinding('class.month-cell')
  monthCellClass = true;

  get month(): string {
    return this.dateService.getMonthName(this.date);
  }

  @HostListener('click')
  onClick() {
    if (this.disabled) {
      return;
    }

    this.select.emit(this.date);
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
}
