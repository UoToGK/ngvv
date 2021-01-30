

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DyFormFieldComponent } from './form-field.component';
import { DyPrefixDirective } from './prefix.directive';
import { DySuffixDirective } from './suffix.directive';

const COMPONENTS = [
  DyFormFieldComponent,
  DyPrefixDirective,
  DySuffixDirective,
];

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ...COMPONENTS ],
  exports: [ ...COMPONENTS ],
})
export class DyFormFieldModule {
}
