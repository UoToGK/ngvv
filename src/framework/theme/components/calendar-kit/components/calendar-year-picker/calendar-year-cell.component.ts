

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { DyDateService } from '../../services/date.service';
import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';


@Component({
  selector: 'dy-calendar-year-cell',
  template: `
    <div class="cell-content">
      {{ year }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarYearCellComponent<D> implements DyCalendarCell<D, D> {
  @Input() date: D;

  @Input() min: D;

  @Input() max: D;

  @Input() selectedValue: D;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Output() select: EventEmitter<D> = new EventEmitter(true);

  constructor(protected dateService: DyDateService<D>) {
  }

  @HostBinding('class.selected') get selected(): boolean {
    return this.dateService.isSameYearSafe(this.date, this.selectedValue);
  }

  @HostBinding('class.today') get today(): boolean {
    return this.dateService.isSameYearSafe(this.date, this.dateService.today());
  }

  @HostBinding('class.disabled') get disabled(): boolean {
    return this.smallerThanMin() || this.greaterThanMax();
  }

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  @HostBinding('class.year-cell')
  yearCellClass = true;

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

  private smallerThanMin(): boolean {
    return this.date && this.min && this.dateService.compareDates(this.yearEnd(), this.min) < 0;
  }

  private greaterThanMax(): boolean {
    return this.date && this.max && this.dateService.compareDates(this.yearStart(), this.max) > 0;
  }

  private yearStart(): D {
    return this.dateService.getYearStart(this.date);
  }

  private yearEnd(): D {
    return this.dateService.getYearEnd(this.date);
  }
}
