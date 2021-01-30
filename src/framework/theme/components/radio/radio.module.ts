/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NgModule } from '@angular/core';

import { DyRadioComponent } from './radio.component';
import { DyRadioGroupComponent } from './radio-group.component';


@NgModule({
  imports: [],
  exports: [DyRadioComponent, DyRadioGroupComponent],
  declarations: [DyRadioComponent, DyRadioGroupComponent],
})
export class DyRadioModule {
}
