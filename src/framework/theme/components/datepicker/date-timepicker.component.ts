import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Inject,
  Input,
  OnInit,
  Optional,
  Type,
} from '@angular/core';
import { Observable } from 'rxjs';

import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DY_DOCUMENT } from '../../theme.options';
import { DyPositionBuilderService } from '../cdk/overlay/overlay-position';
import { DyTriggerStrategyBuilderService } from '../cdk/overlay/overlay-trigger';
import { DyOverlayService } from '../cdk/overlay/overlay-service';
import { DyCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyCalendarWithTimeComponent } from './calendar-with-time.component';
import { DyBasePickerComponent } from './datepicker.component';
import { DY_DATE_SERVICE_OPTIONS } from './datepicker.directive';

@Component({
  selector: 'dy-date-timepicker',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyDateTimePickerComponent<D> extends DyBasePickerComponent<D, D, DyCalendarWithTimeComponent<D>>
                                          implements OnInit {

  protected pickerClass: Type<DyCalendarWithTimeComponent<D>> = DyCalendarWithTimeComponent;

  get value(): any {
    return this.picker ? this.picker.date : undefined;
  }
  set value(date: any) {
    if (!this.picker) {
      this.queue = date;
      return;
    }

    if (date) {
      this.visibleDate = date;
      this.picker.visibleDate = date;
      this.picker.date = date;
      this.picker.cd.markForCheck();
    }
  }

  @Input() step: number;
  @Input() title: string;
  @Input() applyButtonText: string;
  @Input() currentTimeButtonText: string;

  @Input()
  get twelveHoursFormat(): boolean {
    return this._twelveHoursFormat;
  }
  set twelveHoursFormat(value: boolean) {
    this._twelveHoursFormat = convertToBoolProperty(value);
  }
  _twelveHoursFormat: boolean;
  static ngAcceptInputType_twelveHoursFormat: DyBooleanInput;

  @Input()
  get withSeconds(): boolean {
    return this._withSeconds;
  }
  set withSeconds(value: boolean) {
    this._withSeconds = convertToBoolProperty(value);
  }
  _withSeconds: boolean;
  static ngAcceptInputType_withSeconds: DyBooleanInput;

  @Input()
  get singleColumn(): boolean {
    return this._singleColumn;
  }
  set singleColumn(value: boolean) {
    this._singleColumn = convertToBoolProperty(value);
  }
  _singleColumn: boolean;
  static ngAcceptInputType_singleColumn: DyBooleanInput;

  constructor(@Inject(DY_DOCUMENT) document,
              positionBuilder: DyPositionBuilderService,
              triggerStrategyBuilder: DyTriggerStrategyBuilderService,
              overlay: DyOverlayService,
              cfr: ComponentFactoryResolver,
              dateService: DyDateService<D>,
              @Optional() @Inject(DY_DATE_SERVICE_OPTIONS) dateServiceOptions,
              protected calendarWithTimeModelService: DyCalendarTimeModelService<D>) {
    super(document, positionBuilder, triggerStrategyBuilder, overlay, cfr, dateService, dateServiceOptions);
  }

  ngOnInit() {
    this.format = this.format || this.buildTimeFormat();
  }

  protected patchWithInputs() {
    this.picker.singleColumn = this.singleColumn;
    this.picker.twelveHoursFormat = this.twelveHoursFormat;
    this.picker.withSeconds = this.withSeconds;
    this.picker.step = this.step;
    this.picker.title = this.title;
    this.picker.applyButtonText = this.applyButtonText;
    this.picker.currentTimeButtonText = this.currentTimeButtonText;

    if (this.twelveHoursFormat) {
      this.picker.timeFormat = this.dateService.getTwelveHoursFormat();
    } else {
      this.picker.timeFormat = this.withSeconds ? this.dateService.getTwentyFourHoursFormatWithSeconds() :
        this.dateService.getTwentyFourHoursFormat();
    }
    super.patchWithInputs();

    this.picker.cd.markForCheck();
  }

  protected get pickerValueChange(): Observable<any> {
    return this.picker.dateChange;
  }

  protected writeQueue() {
    if (this.queue) {
      const date = this.queue;
      this.queue = null;
      this.value = date;
    }
  }

  protected buildTimeFormat(): string {
    if (this.singleColumn) {
      return this.calendarWithTimeModelService.buildDateFormat(this.twelveHoursFormat);
    } else {
      return this.calendarWithTimeModelService.buildDateFormat(this.twelveHoursFormat, this.withSeconds);
    }
  }
}

