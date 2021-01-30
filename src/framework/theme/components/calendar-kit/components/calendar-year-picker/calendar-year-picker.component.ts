

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  Type,
} from '@angular/core';
import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';
import { DyCalendarYearCellComponent } from './calendar-year-cell.component';
import { DyDateService } from '../../services/date.service';
import { DyCalendarYearModelService } from '../../services/calendar-year-model.service';

@Component({
  selector: 'dy-calendar-year-picker',
  template: `
    <dy-calendar-picker
      [data]="years"
      [min]="min"
      [max]="max"
      [filter]="filter"
      [selectedValue]="date"
      [visibleDate]="year"
      [cellComponent]="cellComponent"
      [size]="size"
      (select)="onSelect($event)">
    </dy-calendar-picker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarYearPickerComponent<D> implements OnChanges {

  @Input() date: D;

  @Input() min: D;

  @Input() max: D;

  @Input() filter: (D) => boolean;

  @Input('cellComponent')
  set _cellComponent(cellComponent: Type<DyCalendarCell<D, D>>) {
    if (cellComponent) {
      this.cellComponent = cellComponent;
    }
  }
  cellComponent: Type<DyCalendarCell<D, D>> = DyCalendarYearCellComponent;

  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @Input() year: D;

  @Output() yearChange = new EventEmitter<D>();

  @HostBinding('class.size-large')
  get large() {
    return this.size === DyCalendarSize.LARGE;
  }

  years: D[][];

  constructor(
    protected dateService: DyDateService<D>,
    protected yearModelService: DyCalendarYearModelService<D>,
  ) {}

  ngOnChanges() {
    this.years = this.yearModelService.getViewYears(this.year);
  }

  onSelect(year) {
    this.yearChange.emit(year);
  }
}
