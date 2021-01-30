import { NgModule } from '@angular/core';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DySharedModule } from '../shared/shared.module';
import { DyInputModule } from '../input/input.module';
import { DyCardModule } from '../card/card.module';
import { DyButtonModule } from '../button/button.module';
import { DySelectComponent, DySelectLabelComponent } from './select.component';
import { DyOptionModule } from '../option/option-list.module';
import { DyIconModule } from '../icon/icon.module';

const DY_SELECT_COMPONENTS = [
  DySelectComponent,
  DySelectLabelComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyOverlayModule,
    DyButtonModule,
    DyInputModule,
    DyCardModule,
    DyIconModule,
    DyOptionModule,
  ],
  exports: [
    ...DY_SELECT_COMPONENTS,
    DyOptionModule,
  ],
  declarations: [...DY_SELECT_COMPONENTS],
})
export class DySelectModule {
}
