/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyListModule } from '../list/list.module';
import { DyCardModule } from '../card/card.module';
import { DyTimePickerDirective } from './timepicker.directive';
import { DyTimePickerComponent } from './timepicker.component';
import { DyTimePickerCellComponent } from './timepicker-cell.component';
import { DyCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';
import { DY_TIME_PICKER_CONFIG, DyTimePickerConfig } from './model';
import { DyCalendarKitModule } from '../calendar-kit/calendar-kit.module';

@NgModule({
  imports: [
    CommonModule,
    DyOverlayModule,
    DyListModule,
    DyCardModule,
    DyCalendarKitModule,
  ],
  providers: [DyCalendarTimeModelService],
  exports: [DyTimePickerComponent, DyTimePickerCellComponent, DyTimePickerDirective],
  declarations: [DyTimePickerComponent, DyTimePickerCellComponent, DyTimePickerDirective],
})
export class DyTimepickerModule {
  static forRoot(config: DyTimePickerConfig = {}): ModuleWithProviders<DyTimepickerModule> {
    return {
      ngModule: DyTimepickerModule,
      providers: [{provide: DY_TIME_PICKER_CONFIG, useValue: config}],
    };
  }

  static forChild(config: DyTimePickerConfig = {}): ModuleWithProviders<DyTimepickerModule> {
    return {
      ngModule: DyTimepickerModule,
      providers: [{provide: DY_TIME_PICKER_CONFIG, useValue: config}],
    };
  }
}
