import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DyOptionComponent } from './option.component';
import { DyOptionGroupComponent } from './option-group.component';
import { DyOptionListComponent } from './option-list.component';
import { DyCheckboxModule } from '../checkbox/checkbox.module';

const DY_OPTION_LIST_COMPONENTS = [
  DyOptionListComponent,
  DyOptionComponent,
  DyOptionGroupComponent,
];

@NgModule({
  declarations: [
    ...DY_OPTION_LIST_COMPONENTS,
  ],
  imports: [
    CommonModule,
    DyCheckboxModule,
  ],
  exports: [
    ...DY_OPTION_LIST_COMPONENTS,
  ],
})
export class DyOptionModule { }
