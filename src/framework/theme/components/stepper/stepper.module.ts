

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyStepperComponent } from './stepper.component';
import { DyStepComponent } from './step.component';
import { DyStepperNextDirective, DyStepperPreviousDirective } from './stepper-button.directive';
import { DyIconModule } from '../icon/icon.module';

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
  ],
  declarations: [
    DyStepperComponent,
    DyStepComponent,
    DyStepperNextDirective,
    DyStepperPreviousDirective,
  ],
  exports: [
    DyStepperComponent,
    DyStepComponent,
    DyStepperNextDirective,
    DyStepperPreviousDirective,
  ],
})
export class DyStepperModule {
}
