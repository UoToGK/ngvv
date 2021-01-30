

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import { DyRouteTabsetComponent } from './route-tabset.component';
import { DyIconModule } from '../icon/icon.module';

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
  ],
  declarations: [
    DyRouteTabsetComponent,
  ],
  exports: [
    DyRouteTabsetComponent,
  ],
})
export class DyRouteTabsetModule { }
