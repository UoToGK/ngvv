
import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import {
  DyLayoutComponent,
  DyLayoutColumnComponent,
  DyLayoutFooterComponent,
  DyLayoutHeaderComponent,
} from './layout.component';

import { DyRestoreScrollTopHelper } from './restore-scroll-top.service';

const DY_LAYOUT_COMPONENTS = [
  DyLayoutComponent,
  DyLayoutColumnComponent,
  DyLayoutFooterComponent,
  DyLayoutHeaderComponent,
];

@NgModule({
  imports: [
    DySharedModule,
  ],
  declarations: [
    ...DY_LAYOUT_COMPONENTS,
  ],
  providers: [
    DyRestoreScrollTopHelper,
  ],
  exports: [
    ...DY_LAYOUT_COMPONENTS,
  ],
})
export class DyLayoutModule { }
