/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DY_DATE_ADAPTER, DyDatepickerDirective } from './datepicker.directive';
import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyCalendarModule } from '../calendar/calendar.module';
import { DyCalendarComponent } from '../calendar/calendar.component';
import { DyDatepickerContainerComponent } from './datepicker-container.component';
import {
  DyDatepickerComponent,
  DyRangepickerComponent,
  DyBasePickerComponent,
} from './datepicker.component';
import { DyCalendarRangeComponent } from '../calendar/calendar-range.component';
import { DyCalendarRangeModule } from '../calendar/calendar-range.module';
import { DyDateAdapterService, DyDateTimeAdapterService, DyRangeAdapterService } from './datepicker-adapter';
import { DyCalendarWithTimeComponent } from './calendar-with-time.component';
import { DyCardModule } from '../card/card.module';
import { DyBaseCalendarModule } from '../calendar/base-calendar.module';
import { DyTimepickerModule } from '../timepicker/timepicker.module';
import { DyCalendarKitModule } from '../calendar-kit/calendar-kit.module';
import { DyDateTimePickerComponent } from './date-timepicker.component';

@NgModule({
  imports: [
    DyOverlayModule,
    DyCalendarModule,
    DyCalendarRangeModule,
    DyCardModule,
    DyBaseCalendarModule,
    DyTimepickerModule,
    DyCalendarKitModule,
  ],
  exports: [
    DyDatepickerDirective,
    DyDatepickerComponent,
    DyRangepickerComponent,
    DyDateTimePickerComponent,
    DyCalendarWithTimeComponent,
  ],
  declarations: [
    DyDatepickerDirective,
    DyDatepickerContainerComponent,
    DyCalendarWithTimeComponent,
    DyDateTimePickerComponent,
    DyDatepickerComponent,
    DyRangepickerComponent,
    DyBasePickerComponent,
  ],
  entryComponents: [
    DyCalendarComponent,
    DyCalendarRangeComponent,
    DyDatepickerContainerComponent,
    DyCalendarWithTimeComponent,
  ],
})
export class DyDatepickerModule {
  static forRoot(): ModuleWithProviders<DyDatepickerModule> {
    return {
      ngModule: DyDatepickerModule,
      providers: [
        DatePipe,
        {
          provide: DY_DATE_ADAPTER,
          multi: true,
          useClass: DyDateAdapterService,
        },
        {
          provide: DY_DATE_ADAPTER,
          multi: true,
          useClass: DyRangeAdapterService,
        },
        {
          provide: DY_DATE_ADAPTER,
          multi: true,
          useClass: DyDateTimeAdapterService,
        },
      ],
    };
  }
}
