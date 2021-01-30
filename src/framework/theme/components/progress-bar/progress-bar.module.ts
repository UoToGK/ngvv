

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyProgressBarComponent } from './progress-bar.component';

@NgModule({
  imports: [
    DySharedModule,
  ],
  declarations: [DyProgressBarComponent],
  exports: [DyProgressBarComponent],
})
export class DyProgressBarModule { }
