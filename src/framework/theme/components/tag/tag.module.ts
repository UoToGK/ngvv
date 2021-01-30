

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyIconModule } from '../icon/icon.module';
import { DyTagComponent } from './tag.component';
import { DyTagListComponent } from './tag-list.component';
import { DyTagInputDirective } from './tag-input.directive';

@NgModule({
  imports: [
    CommonModule,
    DyIconModule,
  ],
  declarations: [
    DyTagComponent,
    DyTagListComponent,
    DyTagInputDirective,
  ],
  exports: [
    DyTagComponent,
    DyTagListComponent,
    DyTagInputDirective,
  ],
})
export class DyTagModule { }
