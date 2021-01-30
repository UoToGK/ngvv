

import { NgModule } from '@angular/core';
import { DySharedModule } from '../shared/shared.module';
import { DySpinnerComponent } from './spinner.component';
import { DySpinnerDirective } from './spinner.directive';


@NgModule({
  imports: [
    DySharedModule,
  ],
  exports: [DySpinnerComponent, DySpinnerDirective],
  declarations: [DySpinnerComponent, DySpinnerDirective],
  entryComponents: [DySpinnerComponent],
})
export class DySpinnerModule {}
