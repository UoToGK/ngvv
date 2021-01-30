

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import { DyTabsetComponent, DyTabComponent } from './tabset.component';
import { DyBadgeModule } from '../badge/badge.module';
import { DyIconModule } from '../icon/icon.module';

const DY_TABSET_COMPONENTS = [
  DyTabsetComponent,
  DyTabComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyBadgeModule,
    DyIconModule,
  ],
  declarations: [
    ...DY_TABSET_COMPONENTS,
  ],
  exports: [
    ...DY_TABSET_COMPONENTS,
  ],
})
export class DyTabsetModule { }
