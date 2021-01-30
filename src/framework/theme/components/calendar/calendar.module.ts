

import { NgModule } from '@angular/core';

import { DyCalendarComponent } from './calendar.component';
import { DyBaseCalendarModule } from './base-calendar.module';


@NgModule({
  imports: [DyBaseCalendarModule],
  exports: [DyCalendarComponent],
  declarations: [DyCalendarComponent],
})
export class DyCalendarModule {
}
