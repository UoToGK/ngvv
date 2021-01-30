

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyCalendarKitModule } from '../calendar-kit/calendar-kit.module';
import { DyCardModule } from '../card/card.module';
import { DyBaseCalendarComponent } from './base-calendar.component';


@NgModule({
  imports: [DyCalendarKitModule, DySharedModule, DyCardModule],
  exports: [DyBaseCalendarComponent],
  declarations: [DyBaseCalendarComponent],
})
export class DyBaseCalendarModule {
}
