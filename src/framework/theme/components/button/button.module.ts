

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import { DyButtonComponent } from './button.component';

const DY_BUTTON_COMPONENTS = [
  DyButtonComponent,
];

@NgModule({
  imports: [
    DySharedModule,
  ],
  declarations: [
    ...DY_BUTTON_COMPONENTS,
  ],
  exports: [
    ...DY_BUTTON_COMPONENTS,
  ],
})
export class DyButtonModule { }
