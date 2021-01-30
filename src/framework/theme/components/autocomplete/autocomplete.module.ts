

import { NgModule } from '@angular/core';

import { DyOverlayModule } from '../cdk/overlay/overlay.module';
import { DyCardModule } from '../card/card.module';
import { DyAutocompleteComponent } from './autocomplete.component';
import { DyAutocompleteDirective } from './autocomplete.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DyOptionModule } from '../option/option-list.module';

const DY_AUTOCOMPLETE_COMPONENTS = [
  DyAutocompleteComponent,
  DyAutocompleteDirective,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DyOverlayModule,
    DyCardModule,
    DyOptionModule,
  ],
   exports: [
     ...DY_AUTOCOMPLETE_COMPONENTS,
     DyOptionModule,
   ],
   declarations: [...DY_AUTOCOMPLETE_COMPONENTS],
})
export class DyAutocompleteModule {
}
