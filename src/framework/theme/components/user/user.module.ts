

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import {
  DyUserComponent,
} from './user.component';
import { DyBadgeModule } from '../badge/badge.module';

const DY_USER_COMPONENTS = [
  DyUserComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyBadgeModule,
  ],
  declarations: [
    ...DY_USER_COMPONENTS,
  ],
  exports: [
    ...DY_USER_COMPONENTS,
  ],
})
export class DyUserModule { }
