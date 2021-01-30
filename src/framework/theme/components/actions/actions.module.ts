

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import { DyActionComponent, DyActionsComponent } from './actions.component';

import { DyBadgeModule } from '../badge/badge.module';
import { DyIconModule } from '../icon/icon.module';

const DY_ACTIONS_COMPONENTS = [
  DyActionComponent,
  DyActionsComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyBadgeModule,
    DyIconModule,
  ],
  declarations: [
    ...DY_ACTIONS_COMPONENTS,
  ],
  exports: [
    ...DY_ACTIONS_COMPONENTS,
  ],
})
export class DyActionsModule { }
