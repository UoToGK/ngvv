

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyIconModule } from '../icon/icon.module';
import { DyCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
  ],
  declarations: [DyCheckboxComponent],
  exports: [DyCheckboxComponent],
})
export class DyCheckboxModule { }
