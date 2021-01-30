

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Type, HostBinding } from '@angular/core';

import { DyCalendarCell, DyCalendarSize, DyCalendarSizeValues } from '../../model';


@Component({
  selector: 'dy-calendar-picker',
  template: `
    <dy-calendar-picker-row
      *ngFor="let row of data"
      [row]="row"
      [visibleDate]="visibleDate"
      [selectedValue]="selectedValue"
      [component]="cellComponent"
      [min]="min"
      [max]="max"
      [filter]="filter"
      [size]="size"
      (select)="select.emit($event)">
    </dy-calendar-picker-row>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarPickerComponent<D, T> {
  @Input() data: D[][];
  @Input() visibleDate: D;
  @Input() selectedValue: T;
  @Input() cellComponent: Type<DyCalendarCell<D, T>>;
  @Input() min: D;
  @Input() max: D;
  @Input() filter: (D) => boolean;
  @Input() size: DyCalendarSize = DyCalendarSize.MEDIUM;
  static ngAcceptInputType_size: DyCalendarSizeValues;
  @Output() select: EventEmitter<D> = new EventEmitter();

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }
}
