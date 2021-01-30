import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DyCalendarComponent } from '../calendar/calendar.component';
import { DySelectedTimePayload } from '../timepicker/model';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';
import { DyCalendarSize } from '../calendar-kit/model';
import { DyPortalOutletDirective } from '../cdk/overlay/mapping';
import { DyTimePickerComponent } from '../timepicker/timepicker.component';

@Component({
  selector: 'dy-calendar-with-time',
  template: `
    <dy-card class="calendar-with-time">
      <dy-card-body class="picker-body">
        <dy-base-calendar
          [boundingMonth]="boundingMonth"
          [startView]="startView"
          [date]="date"
          [min]="min"
          [max]="max"
          [filter]="filter"
          [dayCellComponent]="dayCellComponent"
          [monthCellComponent]="monthCellComponent"
          [yearCellComponent]="yearCellComponent"
          [size]="size"
          [visibleDate]="visibleDate"
          [showNavigation]="showNavigation"
          [showWeekNumber]="showWeekNumber"
          [weekNumberSymbol]="weekNumberSymbol"
          (dateChange)="onDateValueChange($event)">
        </dy-base-calendar>
        <div class="timepicker-section"
             [class.size-large]="isLarge()"
             [class.timepicker-single-column-width]="singleColumn"
             [class.timepicker-multiple-column-width]="!singleColumn">
          <div class="picker-title">{{ title }}</div>
          <dy-timepicker
            (onSelectTime)="onTimeChange($event)"
            [date]="date"
            [twelveHoursFormat]="twelveHoursFormat"
            [withSeconds]="showSeconds()"
            [showFooter]="false"
            [singleColumn]="singleColumn"
            [step]="step">
          </dy-timepicker>
          <ng-container dyPortalOutlet></ng-container>
        </div>
      </dy-card-body>
      <dy-card-footer class="picker-footer">
        <dy-calendar-actions
          [applyButtonText]="applyButtonText"
          [currentTimeButtonText]="currentTimeButtonText"
          (setCurrentTime)="saveCurrentTime()"
          (saveValue)="saveValue()"
        ></dy-calendar-actions>
      </dy-card-footer>
    </dy-card>
  `,
  styleUrls: ['./calendar-with-time-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarWithTimeComponent<D> extends DyCalendarComponent<D> implements OnInit, AfterViewInit {
  /**
   * Defines selected date.
   * */
  @Input() visibleDate: D;

  /**
   * Defines 12 hours format like '07:00 PM'.
   * */
  @Input() twelveHoursFormat: boolean;

  /**
   * Show seconds in timepicker.
   * Ignored when singleColumn is true.
   * */
  @Input() withSeconds: boolean;

  /**
   * Show timepicker values in one column with 60 minutes step by default.
   * */
  @Input() singleColumn: boolean;

  /**
   * Defines minutes step when we use fill time format.
   * If set to 20, it will be: '12:00, 12:20: 12:40, 13:00...'
   * */
  @Input() step: number;

  /**
   * Defines time format.
   * */
  @Input() timeFormat: string;

  /**
   * Defines text over the timepicker.
   * */
  @Input() title: string;

  @Input() applyButtonText: string;

  @Input() currentTimeButtonText: string;

  @ViewChild(DyPortalOutletDirective) portalOutlet: DyPortalOutletDirective;
  @ViewChild(DyTimePickerComponent) timepicker: DyTimePickerComponent<D>;

  constructor(protected dateService: DyDateService<D>,
              public cd: ChangeDetectorRef,
              protected calendarTimeModelService: DyCalendarTimeModelService<D>,
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.date) {
      this.date = this.calendarTimeModelService.getResetTime();
    }
  }

  ngAfterViewInit() {
    this.portalOutlet.attachTemplatePortal(this.timepicker.portal);
  }

  onDateValueChange(date: D): void {
    const hours = this.dateService.getHours(this.date);
    const minutes = this.dateService.getMinutes(this.date);
    const seconds = this.dateService.getSeconds(this.date);
    const milliseconds = this.dateService.getMilliseconds(this.date);

    let newDate = this.dateService.setHours(date, hours);
    newDate = this.dateService.setMinutes(newDate, minutes);
    newDate = this.dateService.setMinutes(newDate, minutes);
    newDate = this.dateService.setSeconds(newDate, seconds);
    newDate = this.dateService.setMilliseconds(newDate, milliseconds);

    this.date = newDate;
  }

  onTimeChange(selectedTime: DySelectedTimePayload<D>): void {
    let newDate = this.dateService.clone(this.date);

    newDate = this.dateService.setHours(newDate, this.dateService.getHours(selectedTime.time));
    newDate = this.dateService.setMinutes(newDate, this.dateService.getMinutes(selectedTime.time));
    newDate = this.dateService.setSeconds(newDate, this.dateService.getSeconds(selectedTime.time));
    newDate = this.dateService.setMilliseconds(newDate, this.dateService.getMilliseconds(selectedTime.time));

    this.date = newDate;
  }

  saveValue(): void {
    this.dateChange.emit(this.date);
  }

  saveCurrentTime(): void {
    this.dateChange.emit(this.dateService.today());
  }

  /**
   * We don't show seconds with twelve hours format
   * */
  showSeconds(): boolean {
    return this.withSeconds && !this.twelveHoursFormat;
  }

  isLarge(): boolean {
    return this.size === DyCalendarSize.LARGE;
  }
}
