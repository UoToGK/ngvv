

import { NgModule } from '@angular/core';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyPopoverDirective } from './popover.directive';
import { DyPopoverComponent } from './popover.component';


@NgModule({
  imports: [DyOverlayModule],
  declarations: [DyPopoverDirective, DyPopoverComponent],
  exports: [DyPopoverDirective],
  entryComponents: [DyPopoverComponent],
})
export class DyPopoverModule {
}
