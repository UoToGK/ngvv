

import { ChangeDetectionStrategy, Component, OnInit, Input, HostBinding } from '@angular/core';

import { DyCalendarDay, DyCalendarSize, DyCalendarSizeValues } from '../../model';
import { DyDateService } from '../../services/date.service';


@Component({
  selector: 'dy-calendar-days-names',
  styleUrls: ['./calendar-days-names.component.scss'],
  template: `
    <div class="day" *ngFor="let day of days" [class.holiday]="day.isHoliday">{{ day.name }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarDaysNamesComponent<D> implements OnInit {

  days: DyCalendarDay[];

  @Input() size: DyCalendarSize;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }

  constructor(private dateService: DyDateService<D>) {
  }

  ngOnInit() {
    const days: DyCalendarDay[] = this.createDaysNames();
    this.days = this.shiftStartOfWeek(days);
  }

  private createDaysNames(): DyCalendarDay[] {
    return this.dateService.getDayOfWeekNames()
      .map(this.markIfHoliday);
  }

  private shiftStartOfWeek(days: DyCalendarDay[]): DyCalendarDay[] {
    for (let i = 0; i < this.dateService.getFirstDayOfWeek(); i++) {
      days.push(days.shift());
    }

    return days;
  }

  private markIfHoliday(name, i) {
    return { name, isHoliday: i % 6 === 0 };
  }
}
