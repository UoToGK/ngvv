

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyIconModule } from '../icon/icon.module';
import { DyAccordionComponent } from './accordion.component';
import { DyAccordionItemComponent } from './accordion-item.component';
import { DyAccordionItemHeaderComponent } from './accordion-item-header.component';
import { DyAccordionItemBodyComponent } from './accordion-item-body.component';

const DY_ACCORDION_COMPONENTS = [
  DyAccordionComponent,
  DyAccordionItemComponent,
  DyAccordionItemHeaderComponent,
  DyAccordionItemBodyComponent,
];

@NgModule({
  imports: [CommonModule, DyIconModule],
  exports: [...DY_ACCORDION_COMPONENTS],
  declarations: [...DY_ACCORDION_COMPONENTS],
  providers: [],
})
export class DyAccordionModule {}
