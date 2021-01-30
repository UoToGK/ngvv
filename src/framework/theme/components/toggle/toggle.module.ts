

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DyIconModule } from '../icon/icon.module';

import { DyToggleComponent } from './toggle.component';

@NgModule({
  imports: [
    CommonModule,
    DyIconModule,
  ],
  declarations: [DyToggleComponent],
  exports: [DyToggleComponent],
})
export class DyToggleModule { }
