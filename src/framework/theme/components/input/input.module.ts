

import { NgModule } from '@angular/core';
import { DySharedModule } from '../shared/shared.module';
import { DyInputDirective } from './input.directive';

const DY_INPUT_COMPONENTS = [
  DyInputDirective,
];

@NgModule({
  imports: [ DySharedModule ],
  declarations: DY_INPUT_COMPONENTS,
  exports: DY_INPUT_COMPONENTS,
})
export class DyInputModule {}
