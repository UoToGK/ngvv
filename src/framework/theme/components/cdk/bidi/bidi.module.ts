import { NgModule } from '@angular/core';
import { BidiModule, Directionality } from '@angular/cdk/bidi';
import { DyDirectionality } from './bidi-service';

@NgModule({
  providers: [
    { provide: DyDirectionality, useExisting: Directionality },
  ],
})
export class DyBidiModule extends BidiModule {}
