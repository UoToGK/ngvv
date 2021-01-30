/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyIconModule } from '../icon/icon.module';

import { DyTooltipComponent } from './tooltip.component';
import { DyTooltipDirective } from './tooltip.directive';


@NgModule({
  imports: [DySharedModule, DyOverlayModule, DyIconModule],
  declarations: [DyTooltipComponent, DyTooltipDirective],
  exports: [DyTooltipDirective],
  entryComponents: [DyTooltipComponent],
})
export class DyTooltipModule {
}
