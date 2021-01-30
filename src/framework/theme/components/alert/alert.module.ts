

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import { DyAlertComponent } from './alert.component';

@NgModule({
  imports: [
    DySharedModule,
  ],
  declarations: [
    DyAlertComponent,
  ],
  exports: [
    DyAlertComponent,
  ],
})
export class DyAlertModule {
}
