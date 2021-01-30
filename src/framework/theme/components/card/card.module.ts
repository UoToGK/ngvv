

import { NgModule } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyIconModule } from '../icon/icon.module';
import {
  DyCardComponent,
  DyCardBodyComponent,
  DyCardFooterComponent,
  DyCardHeaderComponent,
} from './card.component';

import { DyRevealCardComponent } from './reveal-card/reveal-card.component';
import { DyFlipCardComponent } from './flip-card/flip-card.component';
import { DyCardFrontComponent, DyCardBackComponent } from './shared/shared.component';

const DY_CARD_COMPONENTS = [
  DyCardComponent,
  DyCardBodyComponent,
  DyCardFooterComponent,
  DyCardHeaderComponent,
  DyRevealCardComponent,
  DyFlipCardComponent,
  DyCardFrontComponent,
  DyCardBackComponent,
];

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
  ],
  declarations: [
    ...DY_CARD_COMPONENTS,
  ],
  exports: [
    ...DY_CARD_COMPONENTS,
  ],
})
export class DyCardModule { }
